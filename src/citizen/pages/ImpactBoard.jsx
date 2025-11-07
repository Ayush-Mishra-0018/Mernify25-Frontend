import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  TextField,
  AvatarGroup,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RecyclingIcon from "@mui/icons-material/Recycling";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Co2Icon from "@mui/icons-material/Co2";
import { useSocket } from "../../context/SocketContext";
import { jwtDecode } from "jwt-decode";

const ImpactBoard = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [driveData, setDriveData] = useState(null);
  const [impactData, setImpactData] = useState({
    wasteCollected: "",
    carbonOffset: "",
    impactScore: "",
    achievements: "",
    summary: "",
  });
  const [activeUsers, setActiveUsers] = useState([]);
  const [focusedFields, setFocusedFields] = useState({});
  const [remoteCursors, setRemoteCursors] = useState({});
  const updateTimeoutRef = useRef({});
  const currentUserId = useRef(null);
  const currentUserName = useRef(null);

  useEffect(() => {
    // Get current user info from token
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      currentUserId.current = decoded.id;
      currentUserName.current = decoded.name;
    }
    
    fetchDriveData();
  }, [driveId]);

  // Socket connection for collaborative editing
  useEffect(() => {
    if (!socket || !driveId || !currentUserId.current) return;

    // Join impact board room
    socket.emit("joinImpactBoard", {
      driveId,
      userId: currentUserId.current,
      userName: currentUserName.current,
    });

    // Listen for active users
    socket.on("activeImpactUsers", (users) => {
      setActiveUsers(users.filter(u => u.userId !== currentUserId.current));
    });

    // Listen for users joining
    socket.on("userJoinedImpactBoard", (user) => {
      if (user.userId !== currentUserId.current) {
        setActiveUsers((prev) => [...prev, user]);
      }
    });

    // Listen for users leaving
    socket.on("userLeftImpactBoard", ({ userId }) => {
      setActiveUsers((prev) => prev.filter((u) => u.userId !== userId));
      setFocusedFields((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach(field => {
          if (updated[field]?.userId === userId) {
            delete updated[field];
          }
        });
        return updated;
      });
      setRemoteCursors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    // Listen for real-time updates from other users
    socket.on("impactBoardUpdate", ({ field, value, userId }) => {
      if (userId !== currentUserId.current) {
        setImpactData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    });

    // Listen for field focus events
    socket.on("userFocusedField", ({ field, userId, userName }) => {
      if (userId !== currentUserId.current) {
        setFocusedFields((prev) => ({
          ...prev,
          [field]: { userId, userName },
        }));
      }
    });

    // Listen for field blur events
    socket.on("userBlurredField", ({ field, userId }) => {
      if (userId !== currentUserId.current) {
        setFocusedFields((prev) => {
          const updated = { ...prev };
          if (updated[field]?.userId === userId) {
            delete updated[field];
          }
          return updated;
        });
      }
    });

    // Listen for cursor position updates
    socket.on("remoteCursorUpdate", ({ field, userId, userName, cursorPosition }) => {
      if (userId !== currentUserId.current) {
        setRemoteCursors((prev) => ({
          ...prev,
          [userId]: { field, userName, cursorPosition },
        }));
      }
    });

    // Cleanup
    return () => {
      socket.emit("leaveImpactBoard", { driveId, userId: currentUserId.current });
      socket.off("activeImpactUsers");
      socket.off("userJoinedImpactBoard");
      socket.off("userLeftImpactBoard");
      socket.off("impactBoardUpdate");
      socket.off("userFocusedField");
      socket.off("userBlurredField");
      socket.off("remoteCursorUpdate");
    };
  }, [socket, driveId]);

  const fetchDriveData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/impactBoard/${driveId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch drive data");
      }

      const data = await response.json();
      setDriveData(data.drive);
      setImpactData(data.drive.impactData || {
        wasteCollected: "",
        carbonOffset: "",
        impactScore: "",
        achievements: "",
        summary: "",
      });
    } catch (error) {
      console.error("Error fetching drive data:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value, cursorPosition) => {
    // Update local state immediately
    setImpactData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Debounce the API call
    if (updateTimeoutRef.current[field]) {
      clearTimeout(updateTimeoutRef.current[field]);
    }

    updateTimeoutRef.current[field] = setTimeout(async () => {
      const token = localStorage.getItem("token");
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/user/impactBoard/${driveId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ field, value, cursorPosition }),
          }
        );
      } catch (error) {
        console.error("Error updating impact board:", error);
      }
    }, 500);
  };

  const handleFieldFocus = (field, cursorPosition) => {
    if (socket) {
      socket.emit("impactFieldFocus", {
        driveId,
        field,
        userId: currentUserId.current,
        userName: currentUserName.current,
        cursorPosition,
      });
    }
  };

  const handleFieldBlur = (field) => {
    if (socket) {
      socket.emit("impactFieldBlur", {
        driveId,
        field,
        userId: currentUserId.current,
      });
    }
  };

  const handleCursorMove = (field, cursorPosition) => {
    if (socket) {
      socket.emit("cursorPositionUpdate", {
        driveId,
        field,
        userId: currentUserId.current,
        userName: currentUserName.current,
        cursorPosition,
      });
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "#10b981" }} />
      </Container>
    );
  }

  if (!driveData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Drive not found
        </Typography>
      </Container>
    );
  }

  const getFieldLabel = (field) => {
    if (focusedFields[field]) {
      return `${field} (${focusedFields[field].userName} is editing...)`;
    }
    return field;
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, minHeight: "calc(100vh - 100px)" }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
          color: "white",
          borderRadius: 2,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ bgcolor: "#7c3aed" }}>
              <EmojiEventsIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Impact Board 🏆
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {driveData.heading}
              </Typography>
            </Box>
          </Box>
          
          {/* Active Users */}
          {activeUsers.length > 0 && (
            <Tooltip title={`Active users: ${activeUsers.map(u => u.userName).join(", ")}`}>
              <AvatarGroup max={4} sx={{ cursor: "pointer" }}>
                {activeUsers.map((user) => (
                  <Avatar
                    key={user.userId}
                    sx={{
                      bgcolor: "#10b981",
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                    }}
                  >
                    {user.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Tooltip>
          )}
        </Box>
      </Paper>

      {/* Impact Metrics - Editable */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <PeopleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight={700} sx={{ color: "#10b981", mb: 1 }}>
                {driveData.participants?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Participants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              border: focusedFields.wasteCollected ? "2px solid #8b5cf6" : "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.2)",
                  color: "#8b5cf6",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <RecyclingIcon fontSize="large" />
              </Avatar>
              <TextField
                value={impactData.wasteCollected}
                onChange={(e) => handleFieldChange("wasteCollected", e.target.value, e.target.selectionStart)}
                onFocus={(e) => handleFieldFocus("wasteCollected", e.target.selectionStart)}
                onBlur={() => handleFieldBlur("wasteCollected")}
                onSelect={(e) => handleCursorMove("wasteCollected", e.target.selectionStart)}
                placeholder="Enter kg"
                variant="standard"
                sx={{
                  "& .MuiInput-input": {
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#8b5cf6",
                  },
                  "& .MuiInput-input::placeholder": {
                    color: "#6b7280",
                    opacity: 0.7,
                  },
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                {focusedFields.wasteCollected ? `Waste Collected (${focusedFields.wasteCollected.userName} editing)` : "Waste Collected (kg)"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              border: focusedFields.carbonOffset ? "2px solid #06b6d4" : "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(6, 182, 212, 0.2)",
                  color: "#06b6d4",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Co2Icon fontSize="large" />
              </Avatar>
              <TextField
                value={impactData.carbonOffset}
                onChange={(e) => handleFieldChange("carbonOffset", e.target.value, e.target.selectionStart)}
                onFocus={(e) => handleFieldFocus("carbonOffset", e.target.selectionStart)}
                onBlur={() => handleFieldBlur("carbonOffset")}
                onSelect={(e) => handleCursorMove("carbonOffset", e.target.selectionStart)}
                placeholder="Enter kg"
                variant="standard"
                sx={{
                  "& .MuiInput-input": {
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#06b6d4",
                  },
                  "& .MuiInput-input::placeholder": {
                    color: "#6b7280",
                    opacity: 0.7,
                  },
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                {focusedFields.carbonOffset ? `Carbon Offset (${focusedFields.carbonOffset.userName} editing)` : "Carbon Offset (kg CO₂)"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              border: focusedFields.impactScore ? "2px solid #fbbf24" : "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(251, 191, 36, 0.2)",
                  color: "#fbbf24",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                <EmojiEventsIcon fontSize="large" />
              </Avatar>
              <TextField
                value={impactData.impactScore}
                onChange={(e) => handleFieldChange("impactScore", e.target.value, e.target.selectionStart)}
                onFocus={(e) => handleFieldFocus("impactScore", e.target.selectionStart)}
                onBlur={() => handleFieldBlur("impactScore")}
                onSelect={(e) => handleCursorMove("impactScore", e.target.selectionStart)}
                placeholder="Enter score"
                variant="standard"
                sx={{
                  "& .MuiInput-input": {
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#fbbf24",
                  },
                  "& .MuiInput-input::placeholder": {
                    color: "#6b7280",
                    opacity: 0.7,
                  },
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                {focusedFields.impactScore ? `Impact Score (${focusedFields.impactScore.userName} editing)` : "Impact Score"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Collaborative Summary Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          border: focusedFields.summary ? "2px solid #8b5cf6" : "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ color: "#8b5cf6", mb: 2 }}>
          {focusedFields.summary ? `Impact Summary (${focusedFields.summary.userName} is editing...)` : "Impact Summary (Collaborative)"}
        </Typography>
        <TextField
          value={impactData.summary}
          onChange={(e) => handleFieldChange("summary", e.target.value, e.target.selectionStart)}
          onFocus={(e) => handleFieldFocus("summary", e.target.selectionStart)}
          onBlur={() => handleFieldBlur("summary")}
          onSelect={(e) => handleCursorMove("summary", e.target.selectionStart)}
          placeholder="Share the story of this initiative - what was accomplished, challenges overcome, and lessons learned..."
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#e5e7eb",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8b5cf6",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#9ca3af",
              opacity: 0.7,
            },
          }}
        />
        
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 0.5 }}>
              Event Date
            </Typography>
            <Typography variant="body1" sx={{ color: "#e5e7eb" }}>
              {new Date(driveData.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 0.5 }}>
              Status
            </Typography>
            <Chip
              label="Completed"
              sx={{
                bgcolor: "rgba(59, 130, 246, 0.2)",
                color: "#3b82f6",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Collaborative Achievements Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          border: focusedFields.achievements ? "2px solid #10b981" : "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ color: "#10b981", mb: 2 }}>
          {focusedFields.achievements ? `Key Achievements (${focusedFields.achievements.userName} is editing...)` : "Key Achievements (Collaborative)"}
        </Typography>
        <TextField
          value={impactData.achievements}
          onChange={(e) => handleFieldChange("achievements", e.target.value, e.target.selectionStart)}
          onFocus={(e) => handleFieldFocus("achievements", e.target.selectionStart)}
          onBlur={() => handleFieldBlur("achievements")}
          onSelect={(e) => handleCursorMove("achievements", e.target.selectionStart)}
          placeholder="List the key achievements and milestones reached during this initiative..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#e5e7eb",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#10b981",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#9ca3af",
              opacity: 0.7,
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default ImpactBoard;

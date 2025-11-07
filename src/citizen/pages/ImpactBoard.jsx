import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RecyclingIcon from "@mui/icons-material/Recycling";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Co2Icon from "@mui/icons-material/Co2";

const ImpactBoard = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [driveData, setDriveData] = useState(null);

  useEffect(() => {
    fetchDriveData();
  }, [driveId]);

  const fetchDriveData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/drive/${driveId}`,
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
      setDriveData(data);
    } catch (error) {
      console.error("Error fetching drive data:", error);
    } finally {
      setLoading(false);
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
      </Paper>

      {/* Impact Metrics */}
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
              border: "1px solid rgba(255, 255, 255, 0.1)",
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
              <Typography variant="h4" fontWeight={700} sx={{ color: "#8b5cf6", mb: 1 }}>
                {driveData.wasteCollected || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Waste Collected (kg)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

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
              <Typography variant="h4" fontWeight={700} sx={{ color: "#06b6d4", mb: 1 }}>
                {driveData.carbonOffset || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Carbon Offset (kg CO₂)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

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
              <Typography variant="h4" fontWeight={700} sx={{ color: "#fbbf24", mb: 1 }}>
                {driveData.impactScore || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Impact Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Drive Details */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ color: "#8b5cf6", mb: 2 }}>
          Drive Summary
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 0.5 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ color: "#e5e7eb" }}>
              {driveData.description}
            </Typography>
          </Box>
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

      {/* Achievements Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ color: "#8b5cf6", mb: 2 }}>
          Achievements Unlocked 🎯
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Chip
            icon={<EmojiEventsIcon />}
            label="Drive Completed"
            sx={{
              bgcolor: "rgba(251, 191, 36, 0.2)",
              color: "#fbbf24",
              border: "1px solid rgba(251, 191, 36, 0.3)",
            }}
          />
          <Chip
            icon={<PeopleIcon />}
            label="Community Builder"
            sx={{
              bgcolor: "rgba(16, 185, 129, 0.2)",
              color: "#10b981",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          />
          <Chip
            icon={<RecyclingIcon />}
            label="Eco Warrior"
            sx={{
              bgcolor: "rgba(139, 92, 246, 0.2)",
              color: "#8b5cf6",
              border: "1px solid rgba(139, 92, 246, 0.3)",
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default ImpactBoard;

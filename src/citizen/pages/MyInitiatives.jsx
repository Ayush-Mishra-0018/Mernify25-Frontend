import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CancelIcon from "@mui/icons-material/Cancel";
import NewInitiativeModal from "../components/NewInitiativeModal";
import { useSocket } from "../../context/SocketContext";

const MyInitiatives = () => {
  const socket = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiatives, setInitiatives] = useState([]);
  const [filter, setFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [cancelDialog, setCancelDialog] = useState({ open: false, driveId: null });
  const [cancellationReason, setCancellationReason] = useState("");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchInitiatives = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let url = `${import.meta.env.VITE_API_URL}/user/myDrive`;
    if (filter !== "all") {
      url += `?filter=${filter}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInitiatives(data.drives);
      }
    } catch (error) {
      console.error("Error fetching initiatives:", error);
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, [filter]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const userId = JSON.parse(atob(token.split('.')[1])).id;

    // Listen for drive updates (join/leave)
    socket.on("driveUpdated", ({ driveId, participantsCount, action }) => {
      console.log(`📢 Drive ${action}:`, driveId, participantsCount);
      setInitiatives((prevInitiatives) =>
        prevInitiatives.map((drive) =>
          drive._id === driveId
            ? { ...drive, participants: Array(participantsCount).fill(null) }
            : drive
        )
      );
    });

    // Listen for drive cancellation (if someone else cancels a drive you created)
    socket.on("driveCancelled", (cancelledDrive) => {
      console.log("📢 Drive cancelled:", cancelledDrive);
      
      // Update the drive if it's one of the user's drives
      if (cancelledDrive.createdBy === userId || cancelledDrive.createdBy._id === userId) {
        setInitiatives((prevInitiatives) =>
          prevInitiatives.map((drive) =>
            drive._id === cancelledDrive._id
              ? { ...drive, status: "cancelled", cancellationReason: cancelledDrive.cancellationReason }
              : drive
          )
        );
      }
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("driveUpdated");
      socket.off("driveCancelled");
    };
  }, [socket, filter]);


  const handleLaunchInitiative = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("You must be logged in to create an initiative.", "error");
      return;
    }

    const timeFrom = new Date(`${formData.eventDate}T${formData.timeFrom}`);
    const timeTo = new Date(`${formData.eventDate}T${formData.timeTo}`);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/communityDrive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, timeFrom, timeTo }),
        }
      );

      if (response.ok) {
        setIsModalOpen(false);
        showSnackbar("Initiative created successfully!", "success");
        fetchInitiatives();
      } else {
        const errorData = await response.json();
        showSnackbar(`Failed to create initiative: ${errorData.message}`, "error");
      }
    } catch (error) {
      console.error("Error launching initiative:", error);
      showSnackbar("An error occurred while launching the initiative.", "error");
    }
  };

  const handleCancelDrive = (driveId) => {
    setCancelDialog({ open: true, driveId });
    setCancellationReason("");
  };

  const confirmCancelDrive = async () => {
    const token = localStorage.getItem("token");
    const { driveId } = cancelDialog;

    if (!token) {
      showSnackbar("You must be logged in.", "error");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/cancelDrive/${driveId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cancellationReason }),
        }
      );

      if (response.ok) {
        showSnackbar("Drive cancelled successfully.", "success");
        setCancelDialog({ open: false, driveId: null });
        setCancellationReason("");
        fetchInitiatives();
      } else {
        const errorData = await response.json();
        showSnackbar(`Failed to cancel drive: ${errorData.message}`, "error");
      }
    } catch (error) {
      console.error("Error cancelling drive:", error);
      showSnackbar("An error occurred while cancelling the drive.", "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(90deg, #047857 0%, #0e7490 100%)",
            color: "white",
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#10b981", width: 56, height: 56 }}>
                <EventIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  My Initiatives 🌱
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create and manage your community drives
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                bgcolor: "white",
                color: "#047857",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#f0fdf4",
                },
              }}
            >
              Launch New Initiative
            </Button>
          </Box>
        </Paper>

        {/* Filter Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <Chip
            label="All"
            onClick={() => setFilter("all")}
            sx={{
              bgcolor: filter === "all" ? "rgba(16, 185, 129, 0.2)" : "rgba(0, 0, 0, 0.05)",
              color: filter === "all" ? "#10b981" : "#6b7280",
              border: filter === "all" ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: filter === "all" ? "rgba(16, 185, 129, 0.3)" : "rgba(0, 0, 0, 0.1)",
              },
            }}
          />
          <Chip
            label="Active"
            onClick={() => setFilter("active")}
            sx={{
              bgcolor: filter === "active" ? "rgba(16, 185, 129, 0.2)" : "rgba(0, 0, 0, 0.05)",
              color: filter === "active" ? "#10b981" : "#6b7280",
              border: filter === "active" ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: filter === "active" ? "rgba(16, 185, 129, 0.3)" : "rgba(0, 0, 0, 0.1)",
              },
            }}
          />
          <Chip
            label="Completed"
            onClick={() => setFilter("completed")}
            sx={{
              bgcolor: filter === "completed" ? "rgba(16, 185, 129, 0.2)" : "rgba(0, 0, 0, 0.05)",
              color: filter === "completed" ? "#10b981" : "#6b7280",
              border: filter === "completed" ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: filter === "completed" ? "rgba(16, 185, 129, 0.3)" : "rgba(0, 0, 0, 0.1)",
              },
            }}
          />
        </Box>

        {/* Initiatives Grid */}
        {initiatives.length > 0 ? (
          <Grid container spacing={3}>
            {initiatives.map((initiative) => (
              <Grid item xs={12} sm={6} md={4} key={initiative._id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "#047857", flexGrow: 1 }}
                      >
                        {initiative.heading}
                      </Typography>
                      <Chip
                        label={initiative.status}
                        size="large"
                        sx={{
                          bgcolor:
                            initiative.status === "active"
                              ? "rgba(16, 185, 129, 0.1)"
                              : "rgba(107, 114, 128, 0.1)",
                          color:
                            initiative.status === "active" ? "#10b981" : "#6b7280",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          marginLeft: 2,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        mb: 3,
                        maxHeight: "80px",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#10b981",
                          borderRadius: "3px",
                          "&:hover": {
                            backgroundColor: "#059669",
                          },
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {initiative.description}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EventIcon sx={{ fontSize: 18, color: "#047857" }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(initiative.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: "#0e7490" }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(initiative.timeFrom).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(initiative.timeTo).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PeopleIcon sx={{ fontSize: 18, color: "#10b981" }} />
                        <Typography variant="body2" color="text.secondary">
                          {initiative.participants.length} / {initiative.upperLimit}{" "}
                          participants
                        </Typography>
                      </Box>
                    </Box>

                    {/* Cancellation Reason */}
                    {initiative.status === "cancelled" && initiative.cancellationReason && (
                      <Box 
                        sx={{ 
                          mt: 2, 
                          p: 2, 
                          bgcolor: "rgba(239, 68, 68, 0.05)", 
                          borderRadius: 1,
                          borderLeft: "3px solid #ef4444"
                        }}
                      >
                        <Typography variant="caption" color="#ef4444" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                          Cancellation Reason:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {initiative.cancellationReason}
                        </Typography>
                      </Box>
                    )}

                    {/* Cancel Button */}
                    {initiative.status === "active" && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelDrive(initiative._id)}
                          sx={{
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            "&:hover": {
                              borderColor: "#dc2626",
                              bgcolor: "rgba(239, 68, 68, 0.04)",
                            },
                          }}
                        >
                          Cancel Drive
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              bgcolor: "rgba(0, 0, 0, 0.02)",
              borderRadius: 2,
            }}
          >
            <EventIcon sx={{ fontSize: 64, color: "#ffffff", mb: 2 }} />
            <Typography variant="h6" color="#ffffff" gutterBottom>
              No initiatives found
            </Typography>
            <Typography variant="body2" color="#ffffff">
              Get started by launching your first community initiative!
            </Typography>
          </Paper>
        )}
      </Box>

      <NewInitiativeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLaunch={handleLaunchInitiative}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, driveId: null })}>
        <DialogTitle sx={{ background: "linear-gradient(90deg, #047857 0%, #0e7490 100%)", color: "#fff" }}>
          Cancel Drive
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for cancellation (optional):
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Enter cancellation reason..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setCancelDialog({ open: false, driveId: null })}
            sx={{ color: "#6b7280" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCancelDrive}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #047857 0%, #0e7490 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #059669 0%, #0891b2 100%)",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyInitiatives;
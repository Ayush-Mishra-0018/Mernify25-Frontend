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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import CancelIcon from "@mui/icons-material/Cancel";
import NewInitiativeModal from "../components/NewInitiativeModal";

const MyInitiatives = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initiatives, setInitiatives] = useState([]);
  const [filter, setFilter] = useState("all");

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

  const handleLaunchInitiative = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an initiative.");
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
        fetchInitiatives();
      } else {
        const errorData = await response.json();
        alert(`Failed to create initiative: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error launching initiative:", error);
      alert("An error occurred while launching the initiative.");
    }
  };

  const handleCancelDrive = async (driveId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    const cancellationReason = prompt("Please provide a reason for cancellation (optional):");
    
    if (cancellationReason === null) {
      return; // User clicked cancel on prompt
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
        alert("Drive cancelled successfully.");
        fetchInitiatives();
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel drive: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error cancelling drive:", error);
      alert("An error occurred while cancelling the drive.");
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

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {initiative.description}
                    </Typography>

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
    </Container>
  );
};

export default MyInitiatives;
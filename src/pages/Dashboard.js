"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Paper,
  Text,
  Group,
  SimpleGrid,
  Title,
  Tabs,
  Button,
  Loader,
  Center,

  rem,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { FileText, Clock, CheckCircle, AlertCircle, Upload, Eye } from "lucide-react"
import { documentService } from "../services/api"

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.md,
  },

  statCard: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statValue: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  statTitle: {
    fontSize: rem(14),
    fontWeight: 500,
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
  },

  statDescription: {
    fontSize: rem(12),
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[5],
  },

  documentRow: {
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  notificationItem: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,

    "&:last-child": {
      borderBottom: "none",
    },

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}))

export default function Dashboard() {
  const { classes } = useStyles()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("recent")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await documentService.getAllDocuments()
        setDocuments(data)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Calculate document statistics
  const totalDocuments = documents.length
  const pendingDocuments = documents.filter((doc) => doc.status === "pending").length
  const approvedDocuments = documents.filter((doc) => doc.status === "approved").length
  const rejectedDocuments = documents.filter((doc) => doc.status === "rejected").length

  // Get recent documents (last 5)
  const recentDocuments = [...documents].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)).slice(0, 5)

  // Generate mock notifications from document history
  const notifications = documents
    .flatMap((doc) =>
      doc.history.map((event) => ({
        id: `${doc.id}-${event.timestamp}`,
        documentId: doc.id,
        documentTitle: doc.title,
        message: `${event.user} ${event.action.toLowerCase()} "${doc.title}"`,
        timestamp: event.timestamp,
        type: event.action.includes("Approved")
          ? "approved"
          : event.action.includes("Rejected")
            ? "rejected"
            : event.action.includes("review")
              ? "review"
              : "update",
      })),
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Text color="teal" fw={500}>
            Approved
          </Text>
        )
      case "pending":
        return (
          <Text color="orange" fw={500}>
            Pending
          </Text>
        )
      case "rejected":
        return (
          <Text color="red" fw={500}>
            Rejected
          </Text>
        )
      default:
        return (
          <Text color="gray" fw={500}>
            Draft
          </Text>
        )
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approved":
        return <CheckCircle size={20} color="#1caf9a" />
      case "rejected":
        return <AlertCircle size={20} color="#fa5252" />
      case "review":
        return <Clock size={20} color="#fd7e14" />
      default:
        return <FileText size={20} color="#228be6" />
    }
  }

  if (loading) {
    return (
      <Center style={{ height: "100%" }}>
        <Loader />
      </Center>
    )
  }

  return (
    <Container size="xl" className={classes.root}>
      <Group position="apart" mb="md">
        <Title order={2}>Dashboard</Title>
        <Button component={Link} to="/documents/upload" leftIcon={<Upload size={16} />}>
          Upload Document
        </Button>
      </Group>

      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
        ]}
        mb="xl"
      >
        <Paper className={classes.statCard} withBorder>
          <div>
            <Text className={classes.statTitle}>Total Documents</Text>
            <Text className={classes.statValue}>{totalDocuments}</Text>
            <Text className={classes.statDescription}>All documents</Text>
          </div>
          <FileText size={32} color="#228be6" />
        </Paper>

        <Paper className={classes.statCard} withBorder>
          <div>
            <Text className={classes.statTitle}>Pending Review</Text>
            <Text className={classes.statValue}>{pendingDocuments}</Text>
            <Text className={classes.statDescription}>Awaiting approval</Text>
          </div>
          <Clock size={32} color="#fd7e14" />
        </Paper>

        <Paper className={classes.statCard} withBorder>
          <div>
            <Text className={classes.statTitle}>Approved</Text>
            <Text className={classes.statValue}>{approvedDocuments}</Text>
            <Text className={classes.statDescription}>Approved documents</Text>
          </div>
          <CheckCircle size={32} color="#1caf9a" />
        </Paper>

        <Paper className={classes.statCard} withBorder>
          <div>
            <Text className={classes.statTitle}>Rejected</Text>
            <Text className={classes.statValue}>{rejectedDocuments}</Text>
            <Text className={classes.statDescription}>Rejected documents</Text>
          </div>
          <AlertCircle size={32} color="#fa5252" />
        </Paper>
      </SimpleGrid>

      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="recent" icon={<FileText size={16} />}>
            Recent Documents
          </Tabs.Tab>
          <Tabs.Tab value="notifications" icon={<Clock size={16} />}>
            Notifications
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="recent">
          <Paper withBorder>
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <Group key={doc.id} position="apart" className={classes.documentRow} p="md" noWrap>
                  <div style={{ flex: 1 }}>
                    <Group>
                      <FileText size={20} />
                      <div>
                        <Text fw={500}>{doc.title}</Text>
                        <Text size="xs" color="dimmed">
                          {doc.author} • {new Date(doc.date).toLocaleDateString()}
                        </Text>
                      </div>
                    </Group>
                  </div>
                  <Group spacing="xs" noWrap>
                    {getStatusBadge(doc.status)}
                    <Button variant="subtle" component={Link} to={`/documents/${doc.id}`} leftIcon={<Eye size={16} />}>
                      View
                    </Button>
                  </Group>
                </Group>
              ))
            ) : (
              <Text align="center" py="xl" color="dimmed">
                No documents found
              </Text>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <Paper withBorder>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Group key={notification.id} className={classes.notificationItem} noWrap>
                  <div style={{ marginRight: 10 }}>{getNotificationIcon(notification.type)}</div>
                  <div style={{ flex: 1 }}>
                    <Text size="sm">{notification.message}</Text>
                    <Text size="xs" color="dimmed">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Text>
                  </div>
                  <Button variant="subtle" compact component={Link} to={`/documents/${notification.documentId}`}>
                    View
                  </Button>
                </Group>
              ))
            ) : (
              <Text align="center" py="xl" color="dimmed">
                No notifications found
              </Text>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}


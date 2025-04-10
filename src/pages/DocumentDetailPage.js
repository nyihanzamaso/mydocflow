"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Tabs,
  Textarea,
  Avatar,
  Divider,
  Badge,
  Loader,
  Center,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { notifications } from "@mantine/notifications"
import { ArrowLeft, Download, FileText, Clock, CheckCircle, XCircle, MessageSquare, History } from "lucide-react"
import { documentService } from "../services/api"

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },

  previewContainer: {
    height: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
  },

  commentItem: {
    marginBottom: theme.spacing.md,
  },

  historyItem: {
    marginBottom: theme.spacing.md,
  },

  detailItem: {
    marginBottom: theme.spacing.sm,
  },
}))

export default function DocumentDetailPage() {
  const { classes } = useStyles()
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await documentService.getDocumentById(id)
        if (data) {
          setDocument(data)
        } else {
          notifications.show({
            title: "Error",
            message: "Document not found",
            color: "red",
          })
          navigate("/documents")
        }
      } catch (error) {
        console.error("Error fetching document:", error)
        notifications.show({
          title: "Error",
          message: "Failed to load document",
          color: "red",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [id, navigate])

  const handleAddComment = async () => {
    if (!comment.trim()) return

    setSubmitting(true)
    try {
      await documentService.addComment(id, comment)

      notifications.show({
        title: "Success",
        message: "Comment added successfully",
        color: "teal",
      })

      setComment("")

      // In a real app, you would refresh the document data here
      // For now, we'll just simulate adding the comment
      const newComment = {
        id: Date.now(),
        user: "You",
        userInitials: "YO",
        message: comment,
        timestamp: new Date().toISOString(),
      }

      setDocument({
        ...document,
        comments: [...document.comments, newComment],
      })
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to add comment",
        color: "red",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async () => {
    setSubmitting(true)
    try {
      await documentService.updateDocumentStatus(id, "approved")

      notifications.show({
        title: "Success",
        message: "Document approved successfully",
        color: "teal",
      })

      navigate("/documents")
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to approve document",
        color: "red",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    setSubmitting(true)
    try {
      await documentService.updateDocumentStatus(id, "rejected")

      notifications.show({
        title: "Success",
        message: "Document rejected",
        color: "teal",
      })

      navigate("/documents")
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to reject document",
        color: "red",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge color="teal">Approved</Badge>
      case "pending":
        return <Badge color="orange">Pending</Badge>
      case "rejected":
        return <Badge color="red">Rejected</Badge>
      default:
        return <Badge color="gray">Draft</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={20} color="#1caf9a" />
      case "pending":
        return <Clock size={20} color="#fd7e14" />
      case "rejected":
        return <XCircle size={20} color="#fa5252" />
      default:
        return <FileText size={20} />
    }
  }

  if (loading) {
    return (
      <Center style={{ height: "100%" }}>
        <Loader />
      </Center>
    )
  }

  if (!document) {
    return (
      <Center style={{ height: "100%" }}>
        <Text>Document not found</Text>
      </Center>
    )
  }

  return (
    <Container size="xl" py="md">
      <div className={classes.header}>
        <Button variant="subtle" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Title order={2}>{document.title}</Title>
        {getStatusBadge(document.status)}
      </div>

      <Grid>
        <Grid.Col span={12} md={8}>
          <Paper withBorder mb="md">
            <Tabs defaultValue="preview">
              <Tabs.List>
                <Tabs.Tab value="preview" icon={<FileText size={16} />}>
                  Preview
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="preview" pt="xs">
                <div className={classes.previewContainer}>
                  <FileText size={64} color="#ADB5BD" />
                  <Text align="center" mt="md" color="dimmed">
                    Preview not available
                  </Text>
                  <Button variant="outline" mt="md" leftIcon={<Download size={16} />}>
                    Download to view
                  </Button>
                </div>
              </Tabs.Panel>
            </Tabs>
          </Paper>

          <Paper withBorder>
            <Tabs defaultValue="comments">
              <Tabs.List>
                <Tabs.Tab value="comments" icon={<MessageSquare size={16} />}>
                  Comments
                </Tabs.Tab>
                <Tabs.Tab value="history" icon={<History size={16} />}>
                  History
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="comments" p="md">
                {document.comments.map((comment) => (
                  <div key={comment.id} className={classes.commentItem}>
                    <Group align="flex-start">
                      <Avatar radius="xl" size="md">
                        {comment.userInitials}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Group position="apart">
                          <Text size="sm" fw={500}>
                            {comment.user}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {new Date(comment.timestamp).toLocaleString()}
                          </Text>
                        </Group>
                        <Text size="sm" mt={4}>
                          {comment.message}
                        </Text>
                      </div>
                    </Group>
                    {document.comments.indexOf(comment) < document.comments.length - 1 && <Divider my="sm" />}
                  </div>
                ))}

                <Divider my="md" />

                <Group align="flex-start">
                  <Avatar radius="xl" size="md">
                    YO
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      minRows={2}
                    />
                    <Group position="right" mt="xs">
                      <Button onClick={handleAddComment} disabled={!comment.trim() || submitting}>
                        Add Comment
                      </Button>
                    </Group>
                  </div>
                </Group>
              </Tabs.Panel>

              <Tabs.Panel value="history" p="md">
                {document.history.map((event, index) => (
                  <div key={index} className={classes.historyItem}>
                    <Group align="flex-start">
                      <Avatar radius="xl" size="md">
                        <History size={20} />
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Group position="apart">
                          <Text size="sm" fw={500}>
                            {event.action}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {new Date(event.timestamp).toLocaleString()}
                          </Text>
                        </Group>
                        <Text size="sm" color="dimmed" mt={4}>
                          by {event.user}
                        </Text>
                      </div>
                    </Group>
                    {index < document.history.length - 1 && <Divider my="sm" />}
                  </div>
                ))}
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Grid.Col>

        <Grid.Col span={12} md={4}>
          <Paper withBorder p="md">
            <Title order={4} mb="md">
              Document Details
            </Title>

            <div className={classes.detailItem}>
              <Group>
                {getStatusIcon(document.status)}
                <div>
                  <Text size="sm" fw={500}>
                    Status
                  </Text>
                  <Text size="sm" transform="capitalize">
                    {document.status}
                  </Text>
                </div>
              </Group>
            </div>

            <Divider my="sm" />

            <div className={classes.detailItem}>
              <Text size="sm" fw={500}>
                Author
              </Text>
              <Group mt={4}>
                <Avatar size="sm" radius="xl">
                  {document.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                <Text size="sm">{document.author}</Text>
              </Group>
            </div>

            <div className={classes.detailItem}>
              <Text size="sm" fw={500}>
                Category
              </Text>
              <Text size="sm" transform="capitalize" mt={4}>
                {document.category}
              </Text>
            </div>

            <div className={classes.detailItem}>
              <Text size="sm" fw={500}>
                Created
              </Text>
              <Text size="sm" mt={4}>
                {new Date(document.date).toLocaleDateString()}
              </Text>
            </div>

            <div className={classes.detailItem}>
              <Text size="sm" fw={500}>
                Last Modified
              </Text>
              <Text size="sm" mt={4}>
                {new Date(document.lastModified).toLocaleDateString()}
              </Text>
            </div>

            <Divider my="sm" />

            <div className={classes.detailItem}>
              <Text size="sm" fw={500}>
                Description
              </Text>
              <Text size="sm" mt={4}>
                {document.description}
              </Text>
            </div>

            <Button fullWidth variant="outline" mt="lg" leftIcon={<Download size={16} />}>
              Download
            </Button>

            {document.status === "pending" && (
              <>
                <Button
                  fullWidth
                  mt="md"
                  leftIcon={<CheckCircle size={16} />}
                  onClick={handleApprove}
                  disabled={submitting}
                >
                  Approve
                </Button>
                <Button
                  fullWidth
                  mt="md"
                  color="red"
                  leftIcon={<XCircle size={16} />}
                  onClick={handleReject}
                  disabled={submitting}
                >
                  Reject
                </Button>
              </>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}


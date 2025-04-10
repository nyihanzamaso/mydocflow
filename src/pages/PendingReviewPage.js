"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Title,
  Paper,
  Table,
  Text,
  Badge,
  Button,
  Group,
  Menu,
  ActionIcon,
  Loader,
  Center,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { FileText, Eye, Download, CheckCircle, XCircle, MoreHorizontal, Clock } from "lucide-react"
import { notifications } from "@mantine/notifications"
import { documentService } from "../services/api"

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  tableRow: {
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}))

export default function PendingReviewPage() {
  const { classes } = useStyles()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPendingDocuments = async () => {
      try {
        const allDocuments = await documentService.getAllDocuments()
        const pendingDocs = allDocuments.filter((doc) => doc.status === "pending")
        setDocuments(pendingDocs)
      } catch (error) {
        console.error("Error fetching pending documents:", error)
        notifications.show({
          title: "Error",
          message: "Failed to load pending documents",
          color: "red",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPendingDocuments()
  }, [])

  const handleApprove = async (id) => {
    try {
      await documentService.updateDocumentStatus(id, "approved")

      notifications.show({
        title: "Success",
        message: "Document approved successfully",
        color: "teal",
      })

      // Update the local state to remove the approved document
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to approve document",
        color: "red",
      })
    }
  }

  const handleReject = async (id) => {
    try {
      await documentService.updateDocumentStatus(id, "rejected")

      notifications.show({
        title: "Success",
        message: "Document rejected",
        color: "teal",
      })

      // Update the local state to remove the rejected document
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to reject document",
        color: "red",
      })
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
    <Container size="xl" py="md">
      <div className={classes.header}>
        <Group>
          <Clock size={24} color="#fd7e14" />
          <Title order={2}>Pending Review</Title>
        </Group>
      </div>

      <Paper withBorder>
        {documents.length > 0 ? (
          <Table striped>
            <thead>
              <tr>
                <th>Document</th>
                <th>Author</th>
                <th>Date Submitted</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className={classes.tableRow}>
                  <td>
                    <Group spacing="xs">
                      <FileText size={16} />
                      <Text fw={500}>{doc.title}</Text>
                      <Badge size="sm" variant="outline">
                        {doc.type}
                      </Badge>
                    </Group>
                  </td>
                  <td>{doc.author}</td>
                  <td>{new Date(doc.date).toLocaleDateString()}</td>
                  <td>
                    <Badge variant="light" color="blue" size="sm">
                      {doc.category}
                    </Badge>
                  </td>
                  <td>
                    <Group position="right" spacing="xs">
                      <Button variant="subtle" size="xs" component={Link} to={`/documents/${doc.id}`}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="subtle" color="teal" size="xs" onClick={() => handleApprove(doc.id)}>
                        <CheckCircle size={16} />
                      </Button>
                      <Button variant="subtle" color="red" size="xs" onClick={() => handleReject(doc.id)}>
                        <XCircle size={16} />
                      </Button>
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon>
                            <MoreHorizontal size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item icon={<Eye size={16} />} component={Link} to={`/documents/${doc.id}`}>
                            View Details
                          </Menu.Item>
                          <Menu.Item icon={<Download size={16} />}>Download</Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            icon={<CheckCircle size={16} color="#1caf9a" />}
                            onClick={() => handleApprove(doc.id)}
                          >
                            Approve
                          </Menu.Item>
                          <Menu.Item icon={<XCircle size={16} color="#fa5252" />} onClick={() => handleReject(doc.id)}>
                            Reject
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Center py="xl">
            <div style={{ textAlign: "center" }}>
              <Clock size={40} color="#ADB5BD" style={{ margin: "0 auto 1rem" }} />
              <Text fw={500}>No documents pending review</Text>
              <Text size="sm" color="dimmed">
                All documents have been reviewed
              </Text>
            </div>
          </Center>
        )}
      </Paper>
    </Container>
  )
}


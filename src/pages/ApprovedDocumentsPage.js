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
import { FileText, Eye, Download, MoreHorizontal, CheckCircle } from "lucide-react"
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

export default function ApprovedDocumentsPage() {
  const { classes } = useStyles()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApprovedDocuments = async () => {
      try {
        const allDocuments = await documentService.getAllDocuments()
        const approvedDocs = allDocuments.filter((doc) => doc.status === "approved")
        setDocuments(approvedDocs)
      } catch (error) {
        console.error("Error fetching approved documents:", error)
        notifications.show({
          title: "Error",
          message: "Failed to load approved documents",
          color: "red",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedDocuments()
  }, [])

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
          <CheckCircle size={24} color="#1caf9a" />
          <Title order={2}>Approved Documents</Title>
        </Group>
      </div>

      <Paper withBorder>
        {documents.length > 0 ? (
          <Table striped>
            <thead>
              <tr>
                <th>Document</th>
                <th>Author</th>
                <th>Date Approved</th>
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
                  <td>
                    {new Date(
                      doc.history.find((h) => h.action.includes("Approved"))?.timestamp || doc.lastModified,
                    ).toLocaleDateString()}
                  </td>
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
              <CheckCircle size={40} color="#ADB5BD" style={{ margin: "0 auto 1rem" }} />
              <Text fw={500}>No approved documents</Text>
              <Text size="sm" color="dimmed">
                There are no approved documents yet
              </Text>
            </div>
          </Center>
        )}
      </Paper>
    </Container>
  )
}


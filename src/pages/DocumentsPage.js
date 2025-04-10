"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Select,
  Paper,
  Table,
  Text,
  Badge,
  Menu,
  ActionIcon,
  Loader,
  Center,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { FileText, Upload, Search, Filter, Eye, Download, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import { documentService } from "../services/api"

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: theme.spacing.sm,
    },
  },

  filters: {
    display: "flex",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  searchInput: {
    flex: 1,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  filterSelects: {
    display: "flex",
    gap: theme.spacing.md,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
      width: "100%",
    },
  },

  tableRow: {
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}))

export default function DocumentsPage() {
  const { classes } = useStyles()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

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

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

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
        <Title order={2}>All Documents</Title>
        <Button component={Link} to="/documents/upload" leftIcon={<Upload size={16} />}>
          Upload Document
        </Button>
      </div>

      <Paper withBorder p="md" mb="md">
        <div className={classes.filters}>
          <TextInput
            className={classes.searchInput}
            placeholder="Search documents..."
            icon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className={classes.filterSelects}>
            <Select
              placeholder="Filter by status"
              icon={<Filter size={16} />}
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: "all", label: "All Statuses" },
                { value: "approved", label: "Approved" },
                { value: "pending", label: "Pending" },
                { value: "rejected", label: "Rejected" },
              ]}
              sx={{ minWidth: 180 }}
            />

            <Select
              placeholder="Filter by category"
              icon={<Filter size={16} />}
              value={categoryFilter}
              onChange={setCategoryFilter}
              data={[
                { value: "all", label: "All Categories" },
                { value: "financial", label: "Financial" },
                { value: "marketing", label: "Marketing" },
                { value: "legal", label: "Legal" },
                { value: "hr", label: "Human Resources" },
                { value: "technical", label: "Technical" },
              ]}
              sx={{ minWidth: 180 }}
            />
          </div>
        </div>
      </Paper>

      <Paper withBorder>
        <Table striped>
          <thead>
            <tr>
              <th>Document</th>
              <th>Author</th>
              <th>Date</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
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
                  <td>{getStatusBadge(doc.status)}</td>
                  <td style={{ textAlign: "right" }}>
                    <Menu position="bottom-end" withinPortal>
                      <Menu.Target>
                        <ActionIcon>
                          <MoreHorizontal size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item icon={<Eye size={16} />} component={Link} to={`/documents/${doc.id}`}>
                          View
                        </Menu.Item>
                        <Menu.Item icon={<Download size={16} />}>Download</Menu.Item>
                        {doc.status === "pending" && (
                          <>
                            <Menu.Divider />
                            <Menu.Item icon={<CheckCircle size={16} color="#1caf9a" />}>Approve</Menu.Item>
                            <Menu.Item icon={<XCircle size={16} color="#fa5252" />}>Reject</Menu.Item>
                          </>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  <Text color="dimmed">No documents found matching your filters</Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Paper>
    </Container>
  )
}


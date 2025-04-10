"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Title,
  Paper,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Text,
  rem,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { Dropzone, MIME_TYPES } from "@mantine/dropzone"
import { notifications } from "@mantine/notifications"
import { Upload, X, FileText } from "lucide-react"
import { documentService } from "../services/api"

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: theme.spacing.md,
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  fileInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    border: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },
}))

export default function UploadDocumentPage() {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleDrop = (files) => {
    setFile(files[0])
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      notifications.show({
        title: "Error",
        message: "Please select a file to upload",
        color: "red",
      })
      return
    }

    if (!title || !category) {
      notifications.show({
        title: "Error",
        message: "Please fill in all required fields",
        color: "red",
      })
      return
    }

    setUploading(true)

    try {
      const documentData = {
        title,
        description,
        category,
      }

      await documentService.uploadDocument(documentData, file)

      notifications.show({
        title: "Success",
        message: "Document uploaded successfully",
        color: "teal",
      })

      navigate("/documents")
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to upload document",
        color: "red",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container size="md" className={classes.wrapper}>
      <Title order={2} mb="lg">
        Upload Document
      </Title>

      <form onSubmit={handleSubmit}>
        <Paper withBorder p="md" mb="md">
          <Title order={4} mb="md">
            Document Information
          </Title>

          <TextInput
            label="Document Title"
            placeholder="Enter document title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb="md"
          />

          <Textarea
            label="Description"
            placeholder="Enter a brief description of the document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            mb="md"
          />

          <Select
            label="Category"
            placeholder="Select a category"
            required
            value={category}
            onChange={setCategory}
            data={[
              { value: "financial", label: "Financial" },
              { value: "marketing", label: "Marketing" },
              { value: "legal", label: "Legal" },
              { value: "hr", label: "Human Resources" },
              { value: "technical", label: "Technical" },
            ]}
          />
        </Paper>

        <Paper withBorder p="md" mb="md">
          <Title order={4} mb="md">
            Upload File
          </Title>

          {!file ? (
            <Dropzone
              onDrop={handleDrop}
              className={classes.dropzone}
              accept={[
                MIME_TYPES.pdf,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              ]}
              maxSize={10 * 1024 * 1024} // 10MB
            >
              <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: "none" }}>
                <Dropzone.Accept>
                  <Upload size={50} className={classes.icon} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <X size={50} color="red" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <Upload size={50} className={classes.icon} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline align="center">
                    Drag files here or click to select files
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7} align="center">
                    Supports PDF, DOCX, XLSX, PPTX (Max 10MB)
                  </Text>
                </div>
              </Group>
            </Dropzone>
          ) : (
            <div className={classes.fileInfo}>
              <Group>
                <FileText size={24} color="#228be6" />
                <div>
                  <Text fw={500}>{file.name}</Text>
                  <Text size="xs" color="dimmed">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </div>
              </Group>
              <Button variant="subtle" color="red" onClick={removeFile} compact>
                <X size={18} />
              </Button>
            </div>
          )}
        </Paper>

        <Group position="apart">
          <Button variant="subtle" onClick={() => navigate("/documents")}>
            Cancel
          </Button>
          <Button type="submit" loading={uploading} disabled={!file}>
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </Group>
      </form>
    </Container>
  )
}


import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Document service
export const documentService = {
  // Get all documents
  getAllDocuments: async (filters = {}) => {
    try {
      // For demo purposes, we'll return mock data
      // In a real app, this would be:
      // const response = await api.get('/documents', { params: filters });
      // return response.data;

      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockDocuments
    } catch (error) {
      console.error("Error fetching documents:", error)
      throw error
    }
  },

  // Get document by ID
  getDocumentById: async (id) => {
    try {
      // In a real app: const response = await api.get(`/documents/${id}`);
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockDocuments.find((doc) => doc.id === id) || null
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error)
      throw error
    }
  },

  // Upload document
  uploadDocument: async (documentData, file) => {
    try {
      // In a real app, you would use FormData to upload the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", documentData.title)
      formData.append("description", documentData.description)
      formData.append("category", documentData.category)

      // const response = await api.post('/documents', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        message: "Document uploaded successfully",
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      throw error
    }
  },

  // Update document status
  updateDocumentStatus: async (id, status, comment = "") => {
    try {
      // In a real app: const response = await api.patch(`/documents/${id}/status`, { status, comment });
      await new Promise((resolve) => setTimeout(resolve, 800))

      return {
        success: true,
        message: `Document ${status} successfully`,
      }
    } catch (error) {
      console.error(`Error updating document status:`, error)
      throw error
    }
  },

  // Add comment to document
  addComment: async (documentId, comment) => {
    try {
      // In a real app: const response = await api.post(`/documents/${documentId}/comments`, { comment });
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        success: true,
        message: "Comment added successfully",
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      throw error
    }
  },
}

// Mock data
const mockDocuments = [
  {
    id: "DOC-001",
    title: "Q4 Financial Report",
    author: "John Smith",
    authorEmail: "jsmith@example.com",
    date: "2023-12-15",
    status: "approved",
    type: "pdf",
    category: "financial",
    description: "Quarterly financial report for Q4 2023",
    version: "1.0",
    lastModified: "2023-12-15",
    comments: [
      {
        id: 1,
        user: "Emily Johnson",
        userInitials: "EJ",
        message: "Looks good, approved.",
        timestamp: "2023-12-16T10:30:00Z",
      },
    ],
    history: [
      {
        action: "Created",
        user: "John Smith",
        timestamp: "2023-12-15T09:00:00Z",
      },
      {
        action: "Submitted for review",
        user: "John Smith",
        timestamp: "2023-12-15T09:15:00Z",
      },
      {
        action: "Approved",
        user: "Emily Johnson",
        timestamp: "2023-12-16T10:30:00Z",
      },
    ],
  },
  {
    id: "DOC-002",
    title: "Marketing Strategy 2024",
    author: "Emily Johnson",
    authorEmail: "ejohnson@example.com",
    date: "2024-01-05",
    status: "pending",
    type: "docx",
    category: "marketing",
    description: "Marketing strategy and plan for 2024",
    version: "1.1",
    lastModified: "2024-01-07",
    comments: [
      {
        id: 1,
        user: "John Smith",
        userInitials: "JS",
        message: "Can you provide more details on the Q2 campaign?",
        timestamp: "2024-01-06T14:20:00Z",
      },
    ],
    history: [
      {
        action: "Created",
        user: "Emily Johnson",
        timestamp: "2024-01-05T11:00:00Z",
      },
      {
        action: "Updated",
        user: "Emily Johnson",
        timestamp: "2024-01-07T09:30:00Z",
      },
      {
        action: "Submitted for review",
        user: "Emily Johnson",
        timestamp: "2024-01-07T09:45:00Z",
      },
    ],
  },
  {
    id: "DOC-003",
    title: "Product Roadmap",
    author: "Michael Chen",
    authorEmail: "mchen@example.com",
    date: "2024-01-10",
    status: "pending",
    type: "pptx",
    category: "technical",
    description:
      "This document outlines the product roadmap for the next 12 months, including key milestones, feature releases, and strategic initiatives.",
    version: "1.2",
    lastModified: "2024-01-15",
    comments: [
      {
        id: 1,
        user: "Sarah Williams",
        userInitials: "SW",
        message: "The Q3 timeline seems ambitious. Can we discuss the resource allocation for this period?",
        timestamp: "2024-01-12T14:30:00Z",
      },
      {
        id: 2,
        user: "John Smith",
        userInitials: "JS",
        message: "I agree with Sarah. We should consider extending the deadline for the API integration feature.",
        timestamp: "2024-01-13T09:15:00Z",
      },
    ],
    history: [
      {
        action: "Created",
        user: "Michael Chen",
        timestamp: "2024-01-10T10:00:00Z",
      },
      {
        action: "Updated",
        user: "Michael Chen",
        timestamp: "2024-01-12T11:30:00Z",
      },
      {
        action: "Submitted for review",
        user: "Michael Chen",
        timestamp: "2024-01-15T09:45:00Z",
      },
    ],
  },
  {
    id: "DOC-004",
    title: "HR Policy Update",
    author: "Sarah Williams",
    authorEmail: "swilliams@example.com",
    date: "2023-12-20",
    status: "rejected",
    type: "pdf",
    category: "hr",
    description: "Updated HR policies for 2024",
    version: "2.0",
    lastModified: "2023-12-22",
    comments: [
      {
        id: 1,
        user: "David Lee",
        userInitials: "DL",
        message: "The remote work policy needs revision. Please update and resubmit.",
        timestamp: "2023-12-22T16:45:00Z",
      },
    ],
    history: [
      {
        action: "Created",
        user: "Sarah Williams",
        timestamp: "2023-12-20T13:20:00Z",
      },
      {
        action: "Submitted for review",
        user: "Sarah Williams",
        timestamp: "2023-12-20T13:30:00Z",
      },
      {
        action: "Rejected",
        user: "David Lee",
        timestamp: "2023-12-22T16:45:00Z",
      },
    ],
  },
  {
    id: "DOC-005",
    title: "Client Proposal - XYZ Corp",
    author: "John Smith",
    authorEmail: "jsmith@example.com",
    date: "2024-01-12",
    status: "approved",
    type: "pdf",
    category: "marketing",
    description: "Client proposal for XYZ Corporation",
    version: "1.0",
    lastModified: "2024-01-12",
    comments: [
      {
        id: 1,
        user: "Emily Johnson",
        userInitials: "EJ",
        message: "Great proposal, approved!",
        timestamp: "2024-01-14T11:20:00Z",
      },
    ],
    history: [
      {
        action: "Created",
        user: "John Smith",
        timestamp: "2024-01-12T09:10:00Z",
      },
      {
        action: "Submitted for review",
        user: "John Smith",
        timestamp: "2024-01-12T09:15:00Z",
      },
      {
        action: "Approved",
        user: "Emily Johnson",
        timestamp: "2024-01-14T11:20:00Z",
      },
    ],
  },
]


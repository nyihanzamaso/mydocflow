"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
  Group,
  Center,
  Box,
  Select,
  Checkbox,
  rem,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { notifications } from "@mantine/notifications"
import { FileText, Check, X } from "lucide-react"

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      "linear-gradient(250deg, rgba(130, 201, 30, 0), rgba(130, 201, 30, 0) 70%), linear-gradient(180deg, rgba(0, 153, 255, 0.1), rgba(0, 153, 255, 0) 70%)",
    display: "flex",
    alignItems: "center",
  },

  form: {
    borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`,
    minHeight: rem(500),
    maxWidth: rem(500),
    paddingTop: rem(40),
    paddingBottom: rem(40),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      padding: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: rem(120),
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: theme.spacing.xl,
  },

  passwordRequirement: {
    display: "flex",
    alignItems: "center",
    fontSize: theme.fontSizes.xs,
    marginTop: rem(5),
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  passwordRequirementIcon: {
    marginRight: rem(5),
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  passwordRequirementSuccess: {
    color: theme.colors.teal[6],
  },
}))

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
]

function PasswordRequirement({ meets, label }) {
  return (
    <Text color={meets ? "teal" : "red"} sx={{ display: "flex", alignItems: "center" }} mt={5} size="xs">
      {meets ? <Check size={14} /> : <X size={14} />} <span ml={7}>{label}</span>
    </Text>
  )
}

export default function RegisterPage() {
  const { classes } = useStyles()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [role, setRole] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!firstName || !lastName || !email || !password || !confirmPassword || !department || !role) {
      notifications.show({
        title: "Error",
        message: "Please fill in all required fields",
        color: "red",
      })
      return
    }

    if (password !== confirmPassword) {
      notifications.show({
        title: "Error",
        message: "Passwords do not match",
        color: "red",
      })
      return
    }

    if (!agreeToTerms) {
      notifications.show({
        title: "Error",
        message: "You must agree to the terms and conditions",
        color: "red",
      })
      return
    }

    // Check password strength
    const meetsRequirements = requirements.every((requirement) => requirement.re.test(password))
    if (!meetsRequirements) {
      notifications.show({
        title: "Error",
        message: "Password does not meet all requirements",
        color: "red",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, this would be an API call to your Spring Boot backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      notifications.show({
        title: "Success",
        message: "Registration successful! You can now log in.",
        color: "teal",
      })

      navigate("/login")
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Registration failed",
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.wrapper}>
      <Container size={900} my={40}>
        <Paper radius="md" p="xl" withBorder className="slide-in">
          <Center mb={20}>
            <Box
              sx={(theme) => ({
                backgroundColor: theme.colors.teal[1],
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
              })}
            >
              <FileText size={30} color="#1caf9a" />
            </Box>
          </Center>

          <Title align="center" sx={(theme) => ({ fontWeight: 900 })}>
            Create a DocuFlow Account
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Already have an account?{" "}
            <Anchor component={Link} to="/login" size="sm">
              Sign in
            </Anchor>
          </Text>

          <form onSubmit={handleSubmit}>
            <Group grow mb="md" mt="md">
              <TextInput
                label="First Name"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Group>

            <TextInput
              label="Email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              mt="md"
            />

            <Group grow mb="md" mt="md">
              <Select
                label="Department"
                placeholder="Select your department"
                data={[
                  { value: "finance", label: "Finance" },
                  { value: "hr", label: "Human Resources" },
                  { value: "marketing", label: "Marketing" },
                  { value: "operations", label: "Operations" },
                  { value: "it", label: "IT" },
                  { value: "legal", label: "Legal" },
                ]}
                value={department}
                onChange={setDepartment}
                required
              />
              <Select
                label="Role"
                placeholder="Select your role"
                data={[
                  { value: "user", label: "Regular User" },
                  { value: "reviewer", label: "Document Reviewer" },
                  { value: "admin", label: "Administrator" },
                ]}
                value={role}
                onChange={setRole}
                required
              />
            </Group>

            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mt="md"
            />

            <Group spacing={5} grow mt={5}>
              {checks}
            </Group>

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              mt="md"
            />

            <Checkbox
              label="I agree to the terms and conditions"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              mt="xl"
            />

            <Group position="apart" mt="xl">
              <Anchor component={Link} to="/login" size="sm">
                Already have an account? Sign in
              </Anchor>
              <Button type="submit" loading={loading}>
                Register
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  )
}


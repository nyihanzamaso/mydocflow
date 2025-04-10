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
  Divider,
  rem,
} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { notifications } from "@mantine/notifications"
import { FileText } from "lucide-react"
import { useAuth } from "../context/AuthContext"

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
}))

export default function LoginPage() {
  const { classes } = useStyles()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      notifications.show({
        title: "Error",
        message: "Please enter both username and password",
        color: "red",
      })
      return
    }

    setLoading(true)

    try {
      const result = await login(username, password)

      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Welcome to DocuFlow",
          color: "teal",
        })
        navigate("/")
      } else {
        notifications.show({
          title: "Authentication failed",
          message: result.error || "Please check your credentials",
          color: "red",
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred",
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.wrapper}>
      <Container size={420} my={40}>
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
            DocuFlow
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Enter your credentials to access your account
          </Text>

          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username"
              placeholder="username@example.com"
              required
              mt="md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Group position="apart" mt="lg">
              <Anchor component="button" type="button" color="dimmed" onClick={() => {}} size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Sign in
            </Button>
          </form>

          <Text align="center" mt="md">
            Don&apos;t have an account?{" "}
            <Anchor component={Link} to="/register">
              Register
            </Anchor>
          </Text>

          <Divider label="Protected by LDAP Authentication" labelPosition="center" my="lg" />
        </Paper>
      </Container>
    </div>
  )
}


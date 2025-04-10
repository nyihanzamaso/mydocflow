"use client"

import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  AppShell,
  AppShellNavbar, // Use AppShell.Navbar
  AppShellHeader, // Use AppShell.Header
  Text,
  Burger,
  useMantineTheme,
  UnstyledButton,
  Group,
  Avatar,
  Box,
  Menu,
  ActionIcon,
  Divider,
  ScrollArea,
  rem,
  // Removed Navbar, Header, MediaQuery from imports
} from "@mantine/core"
import { createStyles } from "@mantine/styles"; // CORRECTED: Import createStyles from @mantine/styles
import {
  FileText,
  Home,
  LogOut,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  Bell,
  ChevronDown,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"; // CORRECTED: Path to context (assuming src/context)

const useStyles = createStyles((theme) => ({
  // --- Styles remain the same as the previous corrected version ---
  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    transition: "width 0.3s ease",
  },
  // header class might be redundant if only AppShell.Header props are used
  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },
  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  link: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
    },
  },
  linkIcon: {
    marginRight: theme.spacing.sm,
  },
  linkSection: {
    marginBottom: theme.spacing.md,
  },
  linkSectionTitle: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    letterSpacing: rem(0.5),
  },
  // headerSearch/headerUser/headerActions might be partially redundant now
  headerActions: {
    display: "flex",
    alignItems: "center",
  },
  notification: {
    position: "relative",
    "&::after": {
      content: '""',
      display: "block", // Set to 'none' when no notifications
      position: "absolute",
      width: rem(8),
      height: rem(8),
      backgroundColor: theme.colors.red[6],
      borderRadius: "50%",
      top: rem(2),
      right: rem(2),
      border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
  },
  // --- End Styles ---
}))

// Link data remains the same
const navLinks = [
  { link: "/", label: "Dashboard", icon: Home },
  { link: "/documents", label: "All Documents", icon: FileText },
  { link: "/documents/upload", label: "Upload Document", icon: PlusCircle },
]

const workflowLinks = [
  { link: "/pending", label: "Pending Review", icon: Clock },
  { link: "/approved", label: "Approved", icon: CheckCircle },
  { link: "/rejected", label: "Rejected", icon: AlertCircle },
]

export default function MainLayout() {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const { classes, cx } = useStyles()
  const { user, logout } = useAuth() // Auth context hook
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Reusable NavbarLink component
  const NavbarLink = ({ icon: Icon, label, active, onClick }) => {
    return (
      <UnstyledButton className={cx(classes.link, { [classes.linkActive]: active })} onClick={onClick}>
        <Icon size={rem(20)} className={classes.linkIcon} />
        <span>{label}</span>
      </UnstyledButton>
    )
  }

  // Dynamic Header Title Logic
  const getHeaderTitle = (pathname) => {
    const allLinks = [...navLinks, ...workflowLinks, { link: "/profile", label: "User Profile" }];
    const currentLink = allLinks.find(link => link.link === pathname);
    return currentLink ? currentLink.label : "DocuFlow"; // Fallback title
  }
  const headerTitle = getHeaderTitle(location.pathname);


  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      // CORRECTED: Use AppShell.Navbar
      navbar={
        <AppShell.Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 250 }} className={classes.navbar}>
           {/* CORRECTED: Use AppShell.Navbar.Section */}
          <AppShell.Navbar.Section>
            <Group justify="space-between" p="xs">
              <Group gap="xs">
                <FileText size={rem(24)} color={theme.colors.teal[6]} />
                <Text fw={700} size="lg">
                  DocuFlow
                </Text>
              </Group>
            </Group>
          </AppShell.Navbar.Section>

           {/* CORRECTED: Use AppShell.Navbar.Section */}
          <AppShell.Navbar.Section grow className={classes.links} component={ScrollArea} mt="md">
            <div className={classes.linksInner}>
              <div className={classes.linkSection}>
                {navLinks.map((item) => (
                  <NavbarLink
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.link}
                    onClick={() => {
                      navigate(item.link)
                      setOpened(false)
                    }}
                  />
                ))}
              </div>

              <Divider my="sm" />

              <div className={classes.linkSection}>
                <Text className={classes.linkSectionTitle}>Workflow</Text>
                {workflowLinks.map((item) => (
                  <NavbarLink
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.link}
                    onClick={() => {
                      navigate(item.link)
                      setOpened(false)
                    }}
                  />
                ))}
              </div>
            </div>
          </AppShell.Navbar.Section>

           {/* CORRECTED: Use AppShell.Navbar.Section */}
          <AppShell.Navbar.Section className={classes.footer}>
            <Menu position="top-end" withArrow shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton className={classes.link} m="xs">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Avatar src={user?.avatarUrl} radius="xl" size={rem(30)}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {user?.name || "User"}
                        </Text>
                        <Text color="dimmed" size="xs" lineClamp={1}>
                          {user?.email || "user@example.com"}
                        </Text>
                      </Box>
                    </Group>
                    <ChevronDown size={rem(16)} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                 <Menu.Label>Account</Menu.Label>
                 <Menu.Item leftSection={<User size={rem(14)} />} onClick={() => navigate("/profile")}>
                   Profile
                 </Menu.Item>
                 <Menu.Item leftSection={<Settings size={rem(14)} />} disabled>
                   Settings
                 </Menu.Item>
                 <Menu.Divider />
                 <Menu.Item color="red" leftSection={<LogOut size={rem(14)} />} onClick={handleLogout}>
                   Logout
                 </Menu.Item>
               </Menu.Dropdown>
            </Menu>
          </AppShell.Navbar.Section>
        </AppShell.Navbar> // CORRECTED Closing tag
      }
      // CORRECTED: Use AppShell.Header
      header={
        <AppShell.Header height={{ base: 60, md: 70 }} p="md">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
             {/* CORRECTED: Removed MediaQuery wrapper, added hiddenFrom prop */}
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
              hiddenFrom="sm" // Hides burger on 'sm' and larger
            />

            {/* --- Dynamic Title Area --- */}
            {/* Show title only on larger screens */}
            <Group visibleFrom="sm">
              <Text fw={500} size="lg">
                {headerTitle}
              </Text>
            </Group>


            {/* --- Right Actions Area --- */}
            <Group gap="sm">
              <ActionIcon
                 variant="subtle"
                 color="gray"
                 className={classes.notification}
                 onClick={() => { /* Handle notification click */ }}
                 aria-label="Notifications"
               >
                 <Bell size={rem(20)} />
               </ActionIcon>

              {/* CORRECTED: Use Box with visibleFrom instead of MediaQuery */}
              <Box visibleFrom="sm"> {/* Only shows on 'sm' screens and larger */}
                <Menu position="bottom-end" withArrow shadow="md" width={200}>
                  <Menu.Target>
                    <UnstyledButton>
                      <Group gap={7}>
                        <Avatar src={user?.avatarUrl} radius="xl" size={rem(30)}>
                           {user?.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <Text fw={500} size="sm" style={{ lineHeight: 1 }} mr={3}>
                           {user?.name || "User"}
                        </Text>
                        <ChevronDown size={rem(12)} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                   <Menu.Dropdown>
                     <Menu.Label>Account</Menu.Label>
                     <Menu.Item leftSection={<User size={rem(14)} />} onClick={() => navigate("/profile")}>
                       Profile
                     </Menu.Item>
                     <Menu.Item leftSection={<Settings size={rem(14)} />} disabled>
                       Settings
                     </Menu.Item>
                     <Menu.Divider />
                     <Menu.Item color="red" leftSection={<LogOut size={rem(14)} />} onClick={handleLogout}>
                       Logout
                     </Menu.Item>
                   </Menu.Dropdown>
                </Menu>
              </Box>
            </Group>
          </div>
        </AppShell.Header> // CORRECTED Closing tag
      }
    >
      <Outlet />
    </AppShell>
  )
}
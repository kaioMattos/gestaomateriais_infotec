"use client"

import type React from "react"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard,
  Engineering,
  Business,
  Description,
  Receipt,
  Settings,
  AccountCircle,
  Logout,
  Notifications,
} from "@mui/icons-material"
import { useRouter, usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Abrir menu hambúrguer
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  // Fechar menu hambúrguer
  const closeMenu = () => {
    setMenuAnchor(null)
  }

  // Abrir menu do perfil
  const openProfile = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget)
  }

  // Fechar menu do perfil
  const closeProfile = () => {
    setProfileAnchor(null)
  }

  // Navegar para página
  const navigateTo = (path: string) => {
    router.push(path)
    closeMenu()
  }

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/",
    },
    {
      text: "Informações Técnicas",
      icon: <Engineering />,
      path: "/informacoes-tecnicas",
    },
    {
      text: "Comercialização",
      icon: <Business />,
      path: "/comercializacao",
    },
    {
      text: "Minuta Contratual",
      icon: <Description />,
      path: "/minuta-contratual",
    },
    {
      text: "Ata de Preços",
      icon: <Receipt />,
      path: "/ata-precos",
    },
  ]

  return (
    <Box>
      {/* Header */}
      <AppBar position="fixed" sx={{ bgcolor: "white", color: "text.primary", boxShadow: 1 }}>
        <Toolbar>
          {/* Menu Hambúrguer */}
          <IconButton color="inherit" onClick={openMenu} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "primary.main" }}>
            MaterialHub
          </Typography>

          {/* Notificações */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Notifications />
          </IconButton>

          {/* Avatar do usuário */}
          <IconButton onClick={openProfile} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>F</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu de Navegação */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{
          sx: { width: 280, mt: 1 },
        }}
      >
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Gestão de Materiais
          </Typography>
          <Typography variant="caption">Plataforma do Fornecedor</Typography>
        </Box>

        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => navigateTo(item.path)}
            selected={pathname === item.path}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.main",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: pathname === item.path ? "white" : "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={closeMenu} sx={{ mx: 1, borderRadius: 1 }}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </MenuItem>
      </Menu>

      {/* Menu do Perfil */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeProfile}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={closeProfile}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Meu Perfil" />
        </MenuItem>
        <MenuItem onClick={closeProfile}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={closeProfile}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>

      {/* Conteúdo Principal */}
      <Box sx={{ mt: "64px", minHeight: "calc(100vh - 64px)", bgcolor: "grey.50" }}>{children}</Box>
    </Box>
  )
}

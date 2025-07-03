"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material"
import {
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  Business,
  Description,
  Engineering,
  Receipt,
} from "@mui/icons-material"
import { Layout } from "@/components/layout"

// Função simples para gerar dados de teste
function createMaterial(id: number) {
  const categories = ["Cimento", "Aço", "Madeira", "Cerâmica", "Vidro", "Plástico"]
  const statuses = ["approved", "rejected", "pending"]

  return {
    id: id,
    codigo: `MAT${String(id).padStart(6, "0")}`,
    nome: `${categories[id % categories.length]} Premium ${id}`,
    categoria: categories[id % categories.length],
    comercializacao: statuses[id % 3],
    minutaContratual: statuses[(id + 1) % 3],
    informacoesTecnicas: statuses[(id + 2) % 3],
    ataPreco: statuses[id % 3],
    fornecedor: `Fornecedor ${Math.floor(id / 100) + 1}`,
    ultimaAtualizacao: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
  }
}

// Gerar lista de materiais
const materials = []
for (let i = 1; i <= 12500; i++) {
  materials.push(createMaterial(i))
}

export default function Dashboard() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  // Função simples para mudar página
  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  // Função simples para mudar itens por página
  const changeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  // Função simples para obter cor do status
  const getStatusColor = (status: string) => {
    if (status === "approved") return "success"
    if (status === "rejected") return "error"
    return "warning"
  }

  // Função simples para obter texto do status
  const getStatusText = (status: string) => {
    if (status === "approved") return "Aprovado"
    if (status === "rejected") return "Rejeitado"
    return "Pendente"
  }

  // Função simples para obter ícone do status
  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle />
    if (status === "rejected") return <Cancel />
    return <Pending />
  }

  // Calcular indicadores de forma simples
  const commerceApproved = materials.filter((m) => m.comercializacao === "approved").length
  const commerceRejected = materials.filter((m) => m.comercializacao === "rejected").length
  const commercePending = materials.filter((m) => m.comercializacao === "pending").length

  const contractApproved = materials.filter((m) => m.minutaContratual === "approved").length
  const contractRejected = materials.filter((m) => m.minutaContratual === "rejected").length
  const contractPending = materials.filter((m) => m.minutaContratual === "pending").length

  const techApproved = materials.filter((m) => m.informacoesTecnicas === "approved").length
  const techRejected = materials.filter((m) => m.informacoesTecnicas === "rejected").length
  const techPending = materials.filter((m) => m.informacoesTecnicas === "pending").length

  const priceApproved = materials.filter((m) => m.ataPreco === "approved").length
  const priceRejected = materials.filter((m) => m.ataPreco === "rejected").length
  const pricePending = materials.filter((m) => m.ataPreco === "pending").length

  // Materiais da página atual
  const currentMaterials = materials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Componente simples para card de indicador
  const IndicatorCard = ({ title, icon, approved, rejected, pending, total, color }: any) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box sx={{ color: `${color}.main`, mr: 1 }}>{icon}</Box>
          <Typography variant="h6">{title}</Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {pending}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aguardando Avaliação
          </Typography>
        </Box>

        <Box mb={2}>
          <LinearProgress variant="determinate" value={(approved / total) * 100} sx={{ height: 8, borderRadius: 4 }} />
          <Typography variant="body2" color="text.secondary" mt={1}>
            {Math.round((approved / total) * 100)}% Concluído
          </Typography>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="success.main">
                {approved}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Aprovados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="error.main">
                {rejected}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rejeitados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h6" color="warning.main">
                {pending}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pendentes
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          📊 Dashboard - Gerenciamento de Materiais
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Acompanhe o status dos seus materiais e indicadores de performance
        </Typography>

        {/* Indicadores */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <IndicatorCard
              title="Comercialização"
              icon={<Business />}
              approved={commerceApproved}
              rejected={commerceRejected}
              pending={commercePending}
              total={materials.length}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <IndicatorCard
              title="Minuta Contratual"
              icon={<Description />}
              approved={contractApproved}
              rejected={contractRejected}
              pending={contractPending}
              total={materials.length}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <IndicatorCard
              title="Informações Técnicas"
              icon={<Engineering />}
              approved={techApproved}
              rejected={techRejected}
              pending={techPending}
              total={materials.length}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <IndicatorCard
              title="Ata de Preço"
              icon={<Receipt />}
              approved={priceApproved}
              rejected={priceRejected}
              pending={pricePending}
              total={materials.length}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Tabela de Materiais */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              📋 Materiais Cadastrados ({materials.length.toLocaleString()} itens)
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Código</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Nome do Material</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Categoria</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Comercialização</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Minuta</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Info. Técnicas</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Ata Preço</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Última Atualização</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Ações</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentMaterials.map((material) => (
                    <TableRow key={material.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {material.codigo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {material.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {material.fornecedor}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={material.categoria} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={getStatusText(material.comercializacao)}>
                          <Chip
                            icon={getStatusIcon(material.comercializacao)}
                            label={getStatusText(material.comercializacao)}
                            color={getStatusColor(material.comercializacao) as any}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={getStatusText(material.minutaContratual)}>
                          <Chip
                            icon={getStatusIcon(material.minutaContratual)}
                            label={getStatusText(material.minutaContratual)}
                            color={getStatusColor(material.minutaContratual) as any}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={getStatusText(material.informacoesTecnicas)}>
                          <Chip
                            icon={getStatusIcon(material.informacoesTecnicas)}
                            label={getStatusText(material.informacoesTecnicas)}
                            color={getStatusColor(material.informacoesTecnicas) as any}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={getStatusText(material.ataPreco)}>
                          <Chip
                            icon={getStatusIcon(material.ataPreco)}
                            label={getStatusText(material.ataPreco)}
                            color={getStatusColor(material.ataPreco) as any}
                            size="small"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{material.ultimaAtualizacao}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Visualizar detalhes">
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[25, 50, 100, 250]}
              component="div"
              count={materials.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => changePage(newPage)}
              onRowsPerPageChange={(event) => changeRowsPerPage(Number.parseInt(event.target.value, 10))}
              labelRowsPerPage="Itens por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count.toLocaleString() : `mais de ${to.toLocaleString()}`}`
              }
            />
          </CardContent>
        </Card>
      </Box>
    </Layout>
  )
}

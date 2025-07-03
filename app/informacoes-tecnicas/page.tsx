"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Alert,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from "@mui/material"
import {
  Visibility,
  CheckCircle,
  CloudUpload,
  AttachFile,
  Delete,
  ThumbUp,
  ThumbDown,
  Description,
  Warning,
  FileCopy,
  FolderOpen,
  ContentCopy,
} from "@mui/icons-material"
import { Layout } from "@/components/layout"

// Dados mockados
const technicalMaterials = Array.from({ length: 2500 }, (_, i) => ({
  id: i + 1,
  codigo: `MAT${String(i + 1).padStart(6, "0")}`,
  nome: `Material Técnico ${i + 1}`,
  categoria: ["Cimento", "Aço", "Madeira", "Cerâmica"][i % 4],
  status: ["pending", "approved", "rejected"][i % 3],
  caracteristicas: [
    { nome: "Resistência à Compressão", valor: `${20 + (i % 30)} MPa`, unidade: "MPa" },
    { nome: "Densidade", valor: `${2.1 + (i % 10) * 0.1} g/cm³`, unidade: "g/cm³" },
    { nome: "Absorção de Água", valor: `${1 + (i % 5)}%`, unidade: "%" },
    { nome: "Resistência à Flexão", valor: `${5 + (i % 15)} MPa`, unidade: "MPa" },
    { nome: "Módulo de Elasticidade", valor: `${25000 + (i % 5000)} MPa`, unidade: "MPa" },
    { nome: "Coeficiente de Dilatação", valor: `${8 + (i % 4)} x 10⁻⁶/°C`, unidade: "x 10⁻⁶/°C" },
    { nome: "Resistência ao Fogo", valor: `${60 + (i % 120)} min`, unidade: "min" },
    { nome: "Condutividade Térmica", valor: `${0.1 + (i % 20) * 0.01} W/mK`, unidade: "W/mK" },
    { nome: "pH", valor: `${7 + (i % 7)}`, unidade: "" },
    { nome: "Tempo de Cura", valor: `${7 + (i % 21)} dias`, unidade: "dias" },
    { nome: "Resistência Química", valor: ["Excelente", "Boa", "Regular"][i % 3], unidade: "" },
    { nome: "Durabilidade", valor: `${20 + (i % 30)} anos`, unidade: "anos" },
  ],
}))

export default function InformacoesTecnicas() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [proposedValues, setProposedValues] = useState<any>({})
  const [attachments, setAttachments] = useState<any>({})
  const [agreements, setAgreements] = useState<any>({})

  // Estados para modal de anexos
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false)
  const [currentCharacteristic, setCurrentCharacteristic] = useState("")
  const [replicationModalOpen, setReplicationModalOpen] = useState(false)
  const [selectedFileForReplication, setSelectedFileForReplication] = useState<any>(null)
  const [characteristicsForReplication, setCharacteristicsForReplication] = useState<string[]>([])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewDetails = (material: any) => {
    setSelectedMaterial(material)
    setProposedValues({})
    setAttachments({})
    setAgreements({})
    setDialogOpen(true)
  }

  const handleProposedValueChange = (characteristic: string, value: string) => {
    setProposedValues((prev) => ({
      ...prev,
      [characteristic]: value,
    }))
  }

  const handleOpenAttachmentModal = (characteristic: string) => {
    setCurrentCharacteristic(characteristic)
    setAttachmentModalOpen(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
      }))

      setAttachments((prev) => ({
        ...prev,
        [currentCharacteristic]: [...(prev[currentCharacteristic] || []), ...newFiles],
      }))
    }
    setAttachmentModalOpen(false)
  }

  const handleUseExistingFile = (file: any, sourceCharacteristic: string) => {
    const newFile = {
      ...file,
      id: Date.now() + Math.random(), // Novo ID para evitar conflitos
    }

    setAttachments((prev) => ({
      ...prev,
      [currentCharacteristic]: [...(prev[currentCharacteristic] || []), newFile],
    }))
    setAttachmentModalOpen(false)
  }

  const handleRemoveAttachment = (characteristic: string, fileId: number) => {
    setAttachments((prev) => ({
      ...prev,
      [characteristic]: prev[characteristic]?.filter((file: any) => file.id !== fileId) || [],
    }))
  }

  const handleAgree = (characteristic: string) => {
    setAgreements((prev) => ({
      ...prev,
      [characteristic]: "agree",
    }))
    // Limpar proposta e anexos se existir
    if (proposedValues[characteristic]) {
      const newValues = { ...proposedValues }
      delete newValues[characteristic]
      setProposedValues(newValues)
    }
    if (attachments[characteristic]) {
      const newAttachments = { ...attachments }
      delete newAttachments[characteristic]
      setAttachments(newAttachments)
    }
  }

  const handleDisagree = (characteristic: string) => {
    setAgreements((prev) => ({
      ...prev,
      [characteristic]: "disagree",
    }))
  }

  const handleOpenReplicationModal = (file: any, sourceCharacteristic: string) => {
    setSelectedFileForReplication({ ...file, sourceCharacteristic })

    // Encontrar características que têm propostas mas não têm este arquivo
    const characteristicsWithProposals = Object.keys(proposedValues).filter((char) => proposedValues[char])
    const characteristicsWithoutThisFile = characteristicsWithProposals.filter((char) => {
      const charFiles = attachments[char] || []
      return !charFiles.some((f: any) => f.name === file.name)
    })

    setCharacteristicsForReplication(characteristicsWithoutThisFile)
    setReplicationModalOpen(true)
  }

  const handleReplicateFile = () => {
    if (!selectedFileForReplication) return

    characteristicsForReplication.forEach((characteristic) => {
      const newFile = {
        ...selectedFileForReplication,
        id: Date.now() + Math.random(),
      }

      setAttachments((prev) => ({
        ...prev,
        [characteristic]: [...(prev[characteristic] || []), newFile],
      }))
    })

    setReplicationModalOpen(false)
    setSelectedFileForReplication(null)
    setCharacteristicsForReplication([])
  }

  const handleSubmitProposal = () => {
    console.log("Enviando proposta:", { proposedValues, attachments, agreements })
    setDialogOpen(false)
  }

  // Verificar se todas as características foram validadas
  const totalCharacteristics = selectedMaterial?.caracteristicas?.length || 0
  const validatedCharacteristics = Object.keys(agreements).length
  const allValidated = validatedCharacteristics === totalCharacteristics

  // Características que precisam de anexo (têm proposta mas não têm anexo)
  const characteristicsNeedingAttachment = Object.keys(proposedValues).filter(
    (char) => proposedValues[char] && (!attachments[char] || attachments[char].length === 0),
  )

  // Obter todos os arquivos existentes
  const getAllExistingFiles = () => {
    const allFiles: any[] = []
    Object.keys(attachments).forEach((characteristic) => {
      if (attachments[characteristic]) {
        attachments[characteristic].forEach((file: any) => {
          allFiles.push({ ...file, characteristic })
        })
      }
    })
    return allFiles
  }

  const paginatedMaterials = technicalMaterials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "error"
      case "pending":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      case "pending":
        return "Pendente"
      default:
        return "Pendente"
    }
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Informações Técnicas
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Revise e aprove as informações técnicas dos materiais
        </Typography>

        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Materiais para Revisão Técnica
              </Typography>
              <Chip
                label={`${technicalMaterials.filter((m) => m.status === "pending").length} Pendentes`}
                color="warning"
                variant="outlined"
              />
            </Box>

            <TableContainer component={Paper}>
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
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Características</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Ações</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedMaterials.map((material) => (
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
                      </TableCell>
                      <TableCell>
                        <Chip label={material.categoria} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusText(material.status)}
                          color={getStatusColor(material.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{material.caracteristicas.length} características</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Visualizar informações técnicas">
                          <IconButton size="small" color="primary" onClick={() => handleViewDetails(material)}>
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
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={technicalMaterials.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
            />
          </CardContent>
        </Card>

        {/* Dialog Principal */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xl" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>
                <Typography variant="h5" fontWeight="bold">
                  {selectedMaterial?.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Código: {selectedMaterial?.codigo} | Categoria: {selectedMaterial?.categoria}
                </Typography>
              </div>
              <Chip
                label={getStatusText(selectedMaterial?.status)}
                color={getStatusColor(selectedMaterial?.status) as any}
                size="large"
              />
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{ p: 0 }}>
            {selectedMaterial && (
              <Box>
                {/* Header */}
                <Box
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Description /> Avalie as Características Técnicas
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ThumbUp sx={{ color: "#66bb6a" }} />
                        <Typography variant="body2">
                          <strong>Concordar:</strong> Valor correto
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ThumbDown sx={{ color: "#ef5350" }} />
                        <Typography variant="body2">
                          <strong>Não Concordar:</strong> Propor valor
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AttachFile sx={{ color: "#ffa726" }} />
                        <Typography variant="body2">
                          <strong>Anexar:</strong> Para propostas
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FileCopy sx={{ color: "#ab47bc" }} />
                        <Typography variant="body2">
                          <strong>Replicar:</strong> Reutilizar arquivos
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Progresso da Validação */}
                <Box sx={{ p: 3, bgcolor: "#f8f9fa" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" color="primary.main">
                      📊 Progresso da Avaliação
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {validatedCharacteristics} de {totalCharacteristics} características
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(validatedCharacteristics / totalCharacteristics) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {Math.round((validatedCharacteristics / totalCharacteristics) * 100)}% concluído
                  </Typography>
                </Box>

                {/* Características */}
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle color="primary" />
                    Características Técnicas ({selectedMaterial.caracteristicas.length} itens)
                  </Typography>

                  <Grid container spacing={3}>
                    {selectedMaterial.caracteristicas.map((char: any, index: number) => {
                      const agreement = agreements[char.nome]
                      const hasProposal = proposedValues[char.nome]
                      const hasAttachment = attachments[char.nome]?.length > 0

                      return (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                          <Card
                            variant="outlined"
                            sx={{
                              height: "100%",
                              transition: "all 0.3s ease",
                              border:
                                agreement === "agree"
                                  ? "2px solid #66bb6a"
                                  : agreement === "disagree"
                                    ? "2px solid #ef5350"
                                    : "1px solid #e0e0e0",
                              bgcolor:
                                agreement === "agree"
                                  ? "#e8f5e8"
                                  : agreement === "disagree"
                                    ? "#ffebee"
                                    : "background.paper",
                              "&:hover": {
                                boxShadow: 4,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary.main">
                                {char.nome}
                              </Typography>

                              {/* Valor Atual */}
                              <Box
                                sx={{
                                  mb: 3,
                                  p: 2,
                                  background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                                  borderRadius: 2,
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                  💎 Valor Atual
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary.main">
                                  {char.valor}
                                </Typography>
                                {char.unidade && (
                                  <Typography variant="body2" color="text.secondary">
                                    {char.unidade}
                                  </Typography>
                                )}
                              </Box>

                              {/* Botões de Decisão */}
                              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                <Button
                                  variant={agreement === "agree" ? "contained" : "outlined"}
                                  color="success"
                                  startIcon={<ThumbUp />}
                                  onClick={() => handleAgree(char.nome)}
                                  sx={{
                                    flex: 1,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    "&:hover": {
                                      transform: "scale(1.02)",
                                    },
                                  }}
                                >
                                  Concordo
                                </Button>
                                <Button
                                  variant={agreement === "disagree" ? "contained" : "outlined"}
                                  color="error"
                                  startIcon={<ThumbDown />}
                                  onClick={() => handleDisagree(char.nome)}
                                  sx={{
                                    flex: 1,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    "&:hover": {
                                      transform: "scale(1.02)",
                                    },
                                  }}
                                >
                                  Não Concordo
                                </Button>
                              </Stack>

                              {/* Campo de Proposta */}
                              {agreement === "disagree" && (
                                <Box
                                  sx={{
                                    p: 2,
                                    bgcolor: "#fff3e0",
                                    borderRadius: 2,
                                    border: "1px dashed #ff9800",
                                    mb: 2,
                                  }}
                                >
                                  <Typography variant="body2" color="#e65100" gutterBottom fontWeight="bold">
                                    💡 Propor Novo Valor:
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Ex: ${char.valor}`}
                                    value={proposedValues[char.nome] || ""}
                                    onChange={(e) => handleProposedValueChange(char.nome, e.target.value)}
                                    InputProps={{
                                      endAdornment: char.unidade && (
                                        <Typography variant="body2" color="text.secondary">
                                          {char.unidade}
                                        </Typography>
                                      ),
                                      sx: { bgcolor: "white", borderRadius: 1 },
                                    }}
                                  />

                                  {/* Seção de Anexo */}
                                  {hasProposal && (
                                    <Box sx={{ mt: 2 }}>
                                      <Typography variant="body2" color="#e65100" gutterBottom fontWeight="bold">
                                        📎 Anexar Documento Justificativo:
                                      </Typography>
                                      <Button
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        size="small"
                                        fullWidth
                                        onClick={() => handleOpenAttachmentModal(char.nome)}
                                        sx={{
                                          color: "#ff9800",
                                          borderColor: "#ff9800",
                                          "&:hover": {
                                            bgcolor: "#fff3e0",
                                            borderColor: "#f57c00",
                                          },
                                        }}
                                      >
                                        Anexar/Reutilizar Arquivo
                                      </Button>

                                      {/* Lista de anexos desta característica */}
                                      {hasAttachment && (
                                        <Box sx={{ mt: 1 }}>
                                          {attachments[char.nome].map((file: any) => (
                                            <Box
                                              key={file.id}
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                p: 1,
                                                bgcolor: "white",
                                                borderRadius: 1,
                                                mt: 0.5,
                                              }}
                                            >
                                              <Box display="flex" alignItems="center">
                                                <AttachFile sx={{ mr: 1, color: "#ff9800", fontSize: 16 }} />
                                                <Typography variant="caption">{file.name}</Typography>
                                              </Box>
                                              <Box>
                                                <IconButton
                                                  size="small"
                                                  color="secondary"
                                                  onClick={() => handleOpenReplicationModal(file, char.nome)}
                                                  title="Replicar para outras características"
                                                >
                                                  <ContentCopy fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                  size="small"
                                                  color="error"
                                                  onClick={() => handleRemoveAttachment(char.nome, file.id)}
                                                >
                                                  <Delete fontSize="small" />
                                                </IconButton>
                                              </Box>
                                            </Box>
                                          ))}
                                        </Box>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              )}

                              {/* Status Visual */}
                              {agreement && (
                                <Alert
                                  severity={agreement === "agree" ? "success" : "warning"}
                                  sx={{ mt: 1 }}
                                  icon={agreement === "agree" ? <CheckCircle /> : <Warning />}
                                >
                                  {agreement === "agree"
                                    ? "✅ Valor aprovado!"
                                    : hasProposal
                                      ? hasAttachment
                                        ? `✅ Proposta: ${proposedValues[char.nome]} ${char.unidade} (com anexo)`
                                        : `⚠️ Proposta: ${proposedValues[char.nome]} ${char.unidade} (anexo necessário)`
                                      : "⚠️ Aguardando proposta de valor"}
                                </Alert>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>

                {/* Alerta para características que precisam de anexo */}
                {characteristicsNeedingAttachment.length > 0 && (
                  <Box sx={{ p: 3, bgcolor: "#fff3e0" }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        📎 Atenção: {characteristicsNeedingAttachment.length} característica(s) com proposta precisam de
                        anexo:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {characteristicsNeedingAttachment.map((char) => (
                          <Chip key={char} label={char} size="small" color="warning" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </Box>
                    </Alert>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="white" fontWeight="bold">
                📊 {validatedCharacteristics}/{totalCharacteristics} avaliadas • {Object.keys(proposedValues).length}{" "}
                propostas • {characteristicsNeedingAttachment.length} precisam anexo
              </Typography>
            </Box>
            <Button
              onClick={() => setDialogOpen(false)}
              size="large"
              sx={{
                color: "white",
                borderColor: "white",
                fontWeight: "bold",
              }}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitProposal}
              disabled={!allValidated || characteristicsNeedingAttachment.length > 0}
              size="large"
              sx={{
                minWidth: 180,
                bgcolor: "white",
                color: "primary.main",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "scale(1.02)",
                },
                "&:disabled": {
                  bgcolor: "grey.300",
                  color: "grey.500",
                },
              }}
            >
              {!allValidated
                ? `⏳ Avaliar Todas (${totalCharacteristics - validatedCharacteristics} restantes)`
                : characteristicsNeedingAttachment.length > 0
                  ? `📎 Anexar Documentos (${characteristicsNeedingAttachment.length})`
                  : "💾 Enviar Avaliação"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Seleção de Anexo */}
        <Dialog open={attachmentModalOpen} onClose={() => setAttachmentModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FolderOpen color="primary" />
              Anexar Arquivo para: {currentCharacteristic}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Novo Arquivo */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    📤 Novo Arquivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fazer upload de um novo arquivo
                  </Typography>
                  <Button variant="contained" component="label" startIcon={<CloudUpload />} fullWidth sx={{ mt: 2 }}>
                    Selecionar Arquivo
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Card>
              </Grid>

              {/* Arquivos Existentes */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    🔄 Reutilizar Arquivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Usar arquivo já anexado em outra característica
                  </Typography>

                  {getAllExistingFiles().length > 0 ? (
                    <List dense sx={{ maxHeight: 200, overflow: "auto", mt: 1 }}>
                      {getAllExistingFiles().map((file, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleUseExistingFile(file, file.characteristic)}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            mb: 1,
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <AttachFile color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary={file.name} secondary={`De: ${file.characteristic}`} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Nenhum arquivo disponível para reutilização
                    </Alert>
                  )}
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAttachmentModalOpen(false)}>Cancelar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Replicação */}
        <Dialog open={replicationModalOpen} onClose={() => setReplicationModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ContentCopy color="primary" />
              Replicar Arquivo
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Arquivo:</strong> {selectedFileForReplication?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selecione as características que também precisam deste arquivo:
            </Typography>

            {characteristicsForReplication.length > 0 ? (
              <List>
                {Object.keys(proposedValues)
                  .filter((char) => proposedValues[char])
                  .map((characteristic) => {
                    const hasThisFile = attachments[characteristic]?.some(
                      (f: any) => f.name === selectedFileForReplication?.name,
                    )
                    if (hasThisFile) return null

                    return (
                      <ListItem key={characteristic} dense>
                        <ListItemIcon>
                          <Checkbox
                            checked={characteristicsForReplication.includes(characteristic)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCharacteristicsForReplication((prev) => [...prev, characteristic])
                              } else {
                                setCharacteristicsForReplication((prev) => prev.filter((c) => c !== characteristic))
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={characteristic} />
                      </ListItem>
                    )
                  })}
              </List>
            ) : (
              <Alert severity="info">
                Todas as características com propostas já possuem este arquivo ou não há características elegíveis.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplicationModalOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleReplicateFile}
              variant="contained"
              disabled={characteristicsForReplication.length === 0}
            >
              Replicar para {characteristicsForReplication.length} característica(s)
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  )
}

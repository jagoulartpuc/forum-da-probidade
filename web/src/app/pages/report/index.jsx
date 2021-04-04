import React, { useMemo } from "react";
import { Footer, Header, Dropzone, Button } from "@Components";
import { createReport } from "@Services";

import "./style.scss";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Divider,
  TextField,
  IconButton,
  Chip,
  Switch,
  Card,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import { useState, useRef } from "react";
import { maskUtils } from "../../utils/mask-utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faCopy } from "@fortawesome/free-solid-svg-icons";

const IdentificationInputs = ({ nameRef, cpfRef, phoneRef, emailRef }) => {
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <>
      <FormControl className="form-item" style={{ marginTop: 0 }}>
        <InputLabel className="label">Nome</InputLabel>
        <Input inputRef={nameRef} />
      </FormControl>
      <FormControl className="form-item half">
        <InputLabel className="label">CPF</InputLabel>
        <Input
          inputRef={cpfRef}
          value={maskUtils.cpfMask(cpf)}
          onChange={(e) => setCpf(e.target.value)}
        />
      </FormControl>
      <FormControl className="form-item half">
        <InputLabel className="label">Celular</InputLabel>
        <Input
          inputRef={phoneRef}
          value={maskUtils.phoneMask(phone)}
          onChange={(e) => setPhone(e.target.value)}
        />
      </FormControl>
      <FormControl className="form-item ">
        <InputLabel className="label">E-mail</InputLabel>
        <Input type="email" inputRef={emailRef} />
      </FormControl>
    </>
  );
};

export function ReportPage() {
  const [isIdentified, setIsIdentified] = useState(false);
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState(false);
  const [date, setDate] = useState(Date());
  const recipentEmailRef = useRef(null);
  const descriptionRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [recipentsEmails, setRecipientsEmails] = useState([]);
  const [trackingId, setTrackingId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const nameRef = useRef(null);
  const cpfRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const trackingIdRef = useRef(null);

  const handleCopy = async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(trackingId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const addRecipient = () => {
    const { value } = recipentEmailRef.current;
    value && setRecipientsEmails([...recipentsEmails, value]);
  };

  const removeRecipient = (value) => {
    console.log(recipentsEmails.filter((email) => value !== email));
    setRecipientsEmails(recipentsEmails.filter((email) => value !== email));
  };

  function onUpload(file) {
    attachments.push(file);
    setAttachments([...attachments]);
  }

  function removeAttachment(index) {
    attachments.splice(index, 1);
    setAttachments([...attachments]);
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = {
        category,
        urgency,
        date,
        description: descriptionRef.current.value,
        attachments,
        recipentsEmails,
        user: isIdentified
          ? {
              name: nameRef.current.value,
              cpf: cpfRef.current.value.replace(/\D/g, ""),
              phone: phoneRef.current.value.replace(/\D/g, ""),
              email: emailRef.current.value,
            }
          : undefined,
      };

      const { data: response } = await createReport(payload);
      setTrackingId(response.trackingId);
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <div id="report-page">
      <main className="content">
        {trackingId ? (
          <>
            <h3 className="title">Denúncia criada com sucesso</h3>
            <p className="success-text">
              Segue abaixo o número para verificar o andamento da denúncia,
              guarde-o para consultas futuras
            </p>
            <div className="tracking-field-wrapper">
              <input
                className="tracking-field"
                ref={trackingIdRef}
                value={trackingId}
                disabled
              />
              <button
                className="copy-button"
                onClick={handleCopy}
                type="button"
              >
                {isCopied ? "Copiado" : "Copiar"}
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="title">Nova denúncia</h3>
            <section className="form-section">
              <form className="report-form" onSubmit={submit}>
                <FormControl className="form-item third">
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    required
                    value={category}
                    onChange={({ target }) => setCategory(target.value)}
                  >
                    <MenuItem value={1}>Categoria 1</MenuItem>
                    <MenuItem value={2}>Categoria 2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="form-item third">
                  <InputLabel className="label">Urgência</InputLabel>
                  <Select
                    value={urgency}
                    onChange={({ target }) => setUrgency(target.value)}
                  >
                    <MenuItem className="select-option" value={true}>
                      Sim
                    </MenuItem>
                    <MenuItem value={false}>Não</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="form-item date-picker third">
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    style={{ marginTop: "10px" }}
                  >
                    <KeyboardDatePicker
                      InputLabelProps={{ className: "label" }}
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Data da ocorrência"
                      value={date}
                      onChange={(value) => setDate(value)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl className="form-item">
                  <TextField
                    label="Descrição do ocorrido"
                    multiline
                    inputRef={descriptionRef}
                    rowsMax="6"
                  />
                </FormControl>
                <FormControl className="form-item inline">
                  <TextField
                    label="E-mail do denunciado"
                    inputRef={recipentEmailRef}
                    type="email"
                    style={{ flex: 1 }}
                  />
                  <IconButton onClick={addRecipient}>
                    <FontAwesomeIcon icon={faPlus} />
                  </IconButton>
                </FormControl>
                {recipentsEmails.length ? (
                  <div style={{ width: "100%" }}>
                    {recipentsEmails.map((email, index) => (
                      <>
                        <Chip
                          className="email-chip"
                          clickable
                          label={email}
                          key={email}
                          onDelete={() => removeRecipient(email)}
                        />
                      </>
                    ))}
                  </div>
                ) : null}

                <div className="attachments-area">
                  <Dropzone
                    className="attachment-dropzone"
                    onUpload={onUpload}
                  />
                  <div className="attachment-list-wrapper">
                    <h5 className="title">
                      {attachments.length
                        ? "Anexos adicionados:"
                        : "Sem anexos"}
                    </h5>
                    <ul className="attachment-list">
                      {attachments.length &&
                        attachments.map((att, index) => {
                          return (
                            <li key={index} className="list-item">
                              <div className="attachment-name">
                                <p>{att.name}</p>
                                <FontAwesomeIcon
                                  className="remove-attachment-icon"
                                  onClick={() => removeAttachment(index)}
                                  icon={faTrash}
                                />
                              </div>
                              {/* <LinearProgress className="progress" variant="determinate" value={100} /> */}
                              <Divider className="divider" />
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
                <div className="switch-wrapper form-item">
                  <label
                    className={
                      isIdentified ? "switch-label" : "switch-label -active"
                    }
                  >
                    Anônimo
                  </label>
                  <Switch
                    color="primary"
                    checked={isIdentified}
                    onChange={() => setIsIdentified(!isIdentified)}
                  />
                  <label
                    className={
                      isIdentified ? "switch-label -active" : "switch-label"
                    }
                  >
                    Com identificação
                  </label>
                </div>

                {isIdentified && (
                  <IdentificationInputs
                    nameRef={nameRef}
                    phoneRef={phoneRef}
                    cpfRef={cpfRef}
                    emailRef={emailRef}
                  />
                )}

                <Button
                  className="report-submit-button"
                  style={{ margin: "16px 10px", fontWeight: 500 }}
                >
                  Enviar
                </Button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

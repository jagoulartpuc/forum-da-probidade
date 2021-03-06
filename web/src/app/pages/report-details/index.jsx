import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getReport } from "@Services";
import "./style.scss";

function formatDates(dates) {
  return dates.reduce((acc, current) => {
    return [...acc, Intl.DateTimeFormat("pt-br").format(new Date(current))];
  }, []);
}

function listToString(list) {
  if (list.length === 1) {
    return list[0];
  }
  const lastItem = list.pop();
  return `${list.join(", ")} e ${lastItem}`;
}

function ReportItem({ label, value }) {
  return (
    <p className="report-details-item">
      <strong>{label}: </strong>
      {value}
    </p>
  );
}

export default function ReportDetails({ match }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = match.params;
  const history = useHistory();
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data: reportResponse } = await getReport(id);
        console.log(reportResponse);
        setReport(reportResponse);
        setLoading(false);
      } catch (error) {
        history.replace("/");
      }
    };

    fetchReport();
  }, []);
  return loading || !report ? (
    <h1>Carregando...</h1>
  ) : (
    <main id="report-details-page">
      <h2>Detalhes da denúncia</h2>
      <section>
        <ReportItem label="Denunciante" value={report?.author} />
        <ReportItem label="Denunciado" value={report?.companyName} />
        <ReportItem label="Local" value={report?.local} />
        <ReportItem label="Categoria" value={report?.category} />
        <ReportItem label="Descrição do ocorrido" value={report?.description} />
        <ReportItem
          label="Datas da ocorrência"
          value={listToString(formatDates(report?.dates))}
        />
        <ReportItem label="Período" value={report?.reportDetails.period} />
        <ReportItem
          label="Pessoas envolvidas"
          value={listToString(report?.reportDetails.envolvedPeople)}
        />
        <ReportItem
          label="Suspeitos"
          value={listToString(report?.reportDetails.suspects)}
        />
        <ReportItem
          label="Testemunhas"
          value={listToString(report?.reportDetails.witnesses)}
        />
      </section>
    </main>
  );
}

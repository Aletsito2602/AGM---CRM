import React from 'react';

const CertificadosPage = () => {
  const fakeCertificados = [
    { id: 501, traderId: 'TraderX', tipo: 'Certificado de Rendimiento', fechaEmision: '2023-05-01', archivo: 'cert_rend_TX.pdf' },
    { id: 502, traderId: 'TraderY', tipo: 'Certificado de Cuenta Fondeada', fechaEmision: '2023-05-10', archivo: 'cert_fondeo_TY.pdf' },
  ];

  return (
    <div>
      <h1>Certificados</h1>
      <table>
        <thead>
          <tr>
            <th>ID Certificado</th>
            <th>ID Trader</th>
            <th>Tipo de Certificado</th>
            <th>Fecha Emisión</th>
            <th>Archivo</th>
          </tr>
        </thead>
        <tbody>
          {fakeCertificados.map((certificado) => (
            <tr key={certificado.id}>
              <td>{certificado.id}</td>
              <td>{certificado.traderId}</td>
              <td>{certificado.tipo}</td>
              <td>{certificado.fechaEmision}</td>
              <td>{certificado.archivo}</td> {/* Podría ser un enlace de descarga más adelante */} 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificadosPage; 
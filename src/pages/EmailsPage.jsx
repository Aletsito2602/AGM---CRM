import React, { useState } from 'react';
// import { getFunctions, httpsCallable } from 'firebase/functions'; // Uncomment when ready to call cloud function

const EmailsPage = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(''); // For success or error messages

  // const functions = getFunctions(); // Uncomment when ready

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }
    setSending(true);
    setMessage('Enviando correo...');

    // TODO: Replace with actual Firebase Cloud Function call
    console.log('Simulating email send:', { to, subject, body });
    // Example of how you might call the function:
    // try {
    //   const sendEmailFunction = httpsCallable(functions, 'sendEmail'); // Ensure 'sendEmail' matches your function name
    //   const result = await sendEmailFunction({ to, subject, html: body });
    //   setMessage('Correo enviado con éxito: ' + result.data.message);
    //   setTo('');
    //   setSubject('');
    //   setBody('');
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   setMessage('Error al enviar el correo: ' + error.message);
    // } finally {
    //   setSending(false);
    // }

    // Simulating a delay for now
    setTimeout(() => {
      setMessage('Correo enviado (simulado). Reemplazar con llamada a Cloud Function.');
      setSending(false);
      setTo('');
      setSubject('');
      setBody('');
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Enviar Correo Electrónico</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="to" style={styles.label}>Para:</label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={styles.input}
            required
            placeholder="destinatario@example.com"
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="subject" style={styles.label}>Asunto:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={styles.input}
            required
            placeholder="Asunto del correo"
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="body" style={styles.label}>Cuerpo del Mensaje:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={styles.textarea}
            rows="10"
            required
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>
        <button type="submit" style={styles.button} disabled={sending}>
          {sending ? 'Enviando...' : 'Enviar Correo'}
        </button>
        {message && <p style={styles.message(message.startsWith('Error'))}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#e0e6f0',
    backgroundColor: '#1e1e1e',
    minHeight: '100vh',
  },
  header: {
    color: '#b0c4de',
    fontSize: '2em',
    marginBottom: '30px',
    textAlign: 'center',
  },
  form: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '25px',
    backgroundColor: '#2c2c2e',
    borderRadius: '10px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#a0a0a0',
    fontSize: '0.95em',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#e0e6f0',
    boxSizing: 'border-box',
    fontSize: '1em',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#e0e6f0',
    boxSizing: 'border-box',
    fontSize: '1em',
    minHeight: '150px',
    resize: 'vertical',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    display: 'block',
    width: '100%',
    marginTop: '10px',
  },
  message: (isError) => ({
    marginTop: '20px',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    backgroundColor: isError ? '#dc3545' : '#28a745', // Red for error, Green for success
    color: 'white',
  }),
};

export default EmailsPage; 
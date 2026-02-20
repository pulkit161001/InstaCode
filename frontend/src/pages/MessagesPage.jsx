const MessagesPage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        {/* Message Icon */}
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>

        {/* Title */}
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          Messages Coming Soon
        </h1>

        {/* Description */}
        <p style={{ fontSize: '16px', color: '#666', margin: '0' }}>
          We&apos;re working on building your direct messaging feature.
        </p>
      </div>
    </div>
  );
};

export default MessagesPage;

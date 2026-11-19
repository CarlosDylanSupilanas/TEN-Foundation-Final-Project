const WorkerHeaderContainer = ({ onLogout }) => {
  return (
    <>
      <header>
        <h1>Admin dashboard</h1>
        <small className="small">Register workers and generate their QR codes</small>
      </header>
      
      {/* Button for Logout */}
      <button type="button" className="logout" onClick={onLogout}>
        Logout
      </button>
    </>
  );
};

export default WorkerHeaderContainer;
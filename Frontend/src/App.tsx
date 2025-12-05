import GoogleSearch from "./GoogleSearch";


function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '20px 0',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    }}>
      <GoogleSearch />
    </div>
  );
}

export default App;

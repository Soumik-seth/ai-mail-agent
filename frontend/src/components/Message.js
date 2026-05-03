export default function Message({ msg }) {
  return (
    <div style={{ margin: 10 }}>
      <b>{msg.role}:</b> {msg.text}
    </div>
  );
}
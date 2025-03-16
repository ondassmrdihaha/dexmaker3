"use client"; // 👈 This makes it a Client Component

export default function Home() {
  function handleClick() {
    alert("Button clicked! 🚀");
  }

  return (
    <div>
      <h1>Welcome to My Memecoin Project! 🚀</h1>
      <p>This is your Next.js project.</p>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}

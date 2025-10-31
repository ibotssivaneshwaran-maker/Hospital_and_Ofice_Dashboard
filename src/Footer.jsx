import "../src/Modules/Hospital/components/CSS/adminDashBoard.css";

const Footer = () => {
    const patientName = localStorage.getItem("detail") === "hospital" ? "Sugam Medical" : "iBots Inc"
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {patientName}. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;

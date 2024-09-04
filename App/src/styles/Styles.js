function Styles() {
  return (
    <div>
      <style>{`
        .error {
          color: red;
          text-align: center;
          margin-top: 10px;
        }
        .app-name {
          color: blue;
          text-align: center;
          font-family: Calibri;
          font-weight: bold;
          font-size: 45px;
        }
        .help {
           color: GrayText;
           font-family: Arial;
           font-size: 12px;     
        }
        .bar {
           background-color: #0056b3;
           margin-bottom: 6px;
           padding-bottom: 5px;
        }
      `}</style>
    </div>
  );
}

export default Styles;

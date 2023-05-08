import React from "react";
import ReactDOM from "react-dom";
import Nfc from "../lib/";

const buttonStyle = {
  fontSize: 50,
  margin: 20,
};
const ReadButton = () => (
  <button
    style={buttonStyle}
    onClick={() => {
      ReactDOM.unmountComponentAtNode(document.getElementById("nfc-container"));
      ReactDOM.render(
        <Nfc
          read={(records) => {
            alert(records[0].data);
          }}
        />,
        document.getElementById("nfc-container")
      );
    }}
  >
    Read
  </button>
);

const WriteButton = () => (
  <button
    style={buttonStyle}
    onClick={() => {
      ReactDOM.unmountComponentAtNode(document.getElementById("nfc-container"));
      ReactDOM.render(
        <Nfc
          write="Written with nfc-react-web"
          writeCallback={(error) => {
            let callbackMsg = "Write successfull";
            if (error) {
              callbackMsg = `error from writeCallback: ${error}`;
            }
            alert(callbackMsg);
          }}
        />,
        document.getElementById("nfc-container")
      );
    }}
  >
    Write
  </button>
);

const ReadTestButton = () => (
  <button style={buttonStyle} onClick={() => alert("NDEFReader" in window)}>
    Test WebNFC
  </button>
);

const readTag = async () => {
  consoleLog("Iniciando a leitura com Web NFC...");
  if ("NDEFReader" in window) {
    consoleLog("NDEFReader encontrado em window");
    try {
      // eslint-disable-next-line
      const ndef = new NDEFReader();
      // eslint-disable-next-line no-undef
      const ctrl = new AbortController();
      consoleLog("Objeto NDEFReader instanciado" + ndef.toString());

      // teste 1
      consoleLog("> Scan started");
      await ndef.scan({ signal: ctrl.signal });
      consoleLog("depois do await");
      ndef.onreading = (event) => {
        consoleLog("Executou ndef.onreading: " + event.toString());
      };
      ndef.addEventListener("readingerror", () => {
        console.log(
          "Argh! Cannot read data from the NFC tag. Try another one?"
        );
      });
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(`> Serial Number: ${serialNumber}`);
        console.log(`> Records: (${message.records.length})`);
      });

      // teste 2
      // ndef.onreading = (event) => {
      //   const decoder = new TextDecoder();
      //   for (const record of event.message.records) {
      //     consoleLog("Record type:  " + record.recordType);
      //     consoleLog("MIME type:    " + record.mediaType);
      //     consoleLog("=== data ===\n" + decoder.decode(record.data));
      //   }
      // };

      // teste 3
      // await ndef
      //   .scan()
      //   .then(() => {
      //     consoleLog("Scan started successfully.");
      //     ndef.onreadingerror = (event) => {
      //       consoleLog(
      //         "Error! Cannot read data from the NFC tag. Try a different one?"
      //       );
      //     };
      //     ndef.onreading = (event) => {
      //       consoleLog("NDEF message read.");
      //     };
      //   })
      //   .catch((error) => {
      //     consoleLog(`Error! Scan failed to start: ${error}.`);
      //   })
      //   .finally(() => {
      //     consoleLog("Scan finished.");
      //   });
    } catch (error) {
      consoleLog(error);
    }
  } else {
    consoleLog("Web NFC is not supported.");
  }
};

const writeTag = async () => {
  if ("NDEFReader" in window) {
    // eslint-disable-next-line
    const ndef = new NDEFReader();
    try {
      await ndef.write("What Web Can Do Today");
      consoleLog("NDEF message written!");
    } catch (error) {
      consoleLog(error);
    }
  } else {
    consoleLog("Web NFC is not supported.");
  }
};

function consoleLog(data) {
  var logElement = document.getElementById("log");
  logElement.innerHTML += data + "\n";
}

const App = () => (
  <React.Fragment>
    <div>
      Test App
      <div>
        <ReadButton />
        <WriteButton />
        <ReadTestButton />
      </div>
      <div id="nfc-container" />
    </div>
    <div>
      <p>
        <button onClick={readTag}>Test NFC Read</button>
        <button onClick={writeTag}>Test NFC Write</button>
      </p>
      <pre id="log"></pre>
    </div>
  </React.Fragment>
);

export default App;

// client/src/App.js

import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [traffic, setTraffic] = useState([]);

  useEffect(() => {

    fetchTraffic();

  }, []);

  const fetchTraffic = async () => {

    try {

      const res = await axios.get(
        'https://ciphernet-sentinel.onrender.com/traffic'
      );

      setTraffic(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold text-green-400 mb-10">

        CipherNet-Sentinel

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {traffic.map((item, index) => (

          <div
            key={index}
            className="bg-gray-900 p-6 rounded-xl border border-green-500"
          >

            <h2 className="text-xl font-bold text-green-400">
              {item.ip}
            </h2>

            <p className="mt-3">
              Packets: {item.packets}
            </p>

            <p className="mt-2">
              Protocol: {item.protocol}
            </p>

            <p className="mt-2">
              Threat Level:
              <span className="text-red-400 ml-2">
                {item.threat}
              </span>
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default App;

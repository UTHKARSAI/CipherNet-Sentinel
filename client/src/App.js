import React, {
  useEffect,
  useState,
} from "react";

import io from "socket.io-client";

import {
  FaInstagram,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,

} from "recharts";

const socket = io(
  "http://localhost:5000"
);

function App() {

  const [traffic, setTraffic] =
    useState([]);

  const [chartData, setChartData] =
    useState([]);

  const [activeDevices,
    setActiveDevices] =
      useState(0);

  const [suspiciousIPs,
    setSuspiciousIPs] =
      useState({});

  const [stats, setStats] =
    useState({

      total: 0,

      tcp: 0,

      udp: 0,

      threats: 0,

    });

  useEffect(() => {

    socket.on(
      "live-traffic",
      (data) => {

        const item = data.packet;

        setTraffic((prev) => [
          item,
          ...prev.slice(0, 14),
        ]);

        setActiveDevices(
          data.activeDevices
        );

        setSuspiciousIPs(
          data.suspiciousIPs
        );

        setStats((prev) => {

          const updated = {

            total: prev.total + 1,

            tcp:
              item.protocol === "TCP"
                ? prev.tcp + 1
                : prev.tcp,

            udp:
              item.protocol === "UDP"
                ? prev.udp + 1
                : prev.udp,

            threats:
              item.suspicious
                ? prev.threats + 1
                : prev.threats,

          };

          setChartData((old) => [

            ...old.slice(-14),

            {
              packets:
                updated.total,

              tcp:
                updated.tcp,

              udp:
                updated.udp,

            },

          ]);

          return updated;

        });

      }
    );

  }, []);

  const getProtocolColor =
    (protocol) => {

      if (protocol === "TCP")
        return "#22c55e";

      if (protocol === "UDP")
        return "#f59e0b";

      if (protocol === "ICMP")
        return "#ef4444";

      return "#06b6d4";
    };

  const getThreatColor =
    (level) => {

      if (level === "HIGH")
        return "#ef4444";

      if (level === "MEDIUM")
        return "#f59e0b";

      if (level === "LOW")
        return "#22c55e";

      return "#06b6d4";
    };

  return (

    <div
      style={{

        background:
          "radial-gradient(circle at top, #111827 0%, #020617 45%, #000000 100%)",

        minHeight: "100vh",

        color: "#22c55e",

        fontFamily:
          "'Share Tech Mono', monospace",

        padding: "20px",

        overflow: "hidden",

        position: "relative",

      }}
    >

      {/* CYBER GLOW EFFECT */}

      <div
        style={{

          position: "absolute",

          top: "-200px",

          left: "-200px",

          width: "600px",

          height: "600px",

          background:
            "rgba(34,197,94,0.08)",

          filter:
            "blur(120px)",

          borderRadius: "50%",

          zIndex: 0,

        }}
      />

      <div
        style={{

          position: "absolute",

          bottom: "-200px",

          right: "-200px",

          width: "500px",

          height: "500px",

          background:
            "rgba(239,68,68,0.08)",

          filter:
            "blur(120px)",

          borderRadius: "50%",

          zIndex: 0,

        }}
      />

      {/* CONTENT */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            borderBottom:
              "1px solid #22c55e",

            paddingBottom: "15px",
          }}
        >

          <div>

            <h1
              style={{
                color: "#22c55e",

                textShadow:
                  "0 0 15px #22c55e",

                fontSize: "42px",

                fontFamily:
                  "Orbitron",
              }}
            >
              CipherNet Sentinel
            </h1>

            <p
              style={{
                color: "#06b6d4",
              }}
            >
              AI Threat Intelligence
              System
            </p>

          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >

            <p>
              🟢 SYSTEM:
              ACTIVE
            </p>

            <p>
              🛡 THREAT ENGINE:
              RUNNING
            </p>

          </div>

        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",

            gap: "20px",

            marginTop: "30px",
          }}
        >

          <StatCard
            title="TOTAL PACKETS"
            value={stats.total}
            color="#22c55e"
          />

          <StatCard
            title="ACTIVE DEVICES"
            value={activeDevices}
            color="#06b6d4"
          />

          <StatCard
            title="TCP TRAFFIC"
            value={stats.tcp}
            color="#22c55e"
          />

          <StatCard
            title="THREAT ALERTS"
            value={stats.threats}
            color="#ef4444"
          />

        </div>

        {/* GRAPH */}

        <div
          style={glassCard}
        >

          <h2>
            LIVE TRAFFIC ANALYTICS
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={chartData}
            >

              <CartesianGrid
                stroke="#1f2937"
              />

              <XAxis
                dataKey="packets"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="tcp"
                stroke="#22c55e"
              />

              <Line
                type="monotone"
                dataKey="udp"
                stroke="#f59e0b"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* SUSPICIOUS IPS */}

        <div
          style={{
            marginTop: "40px",
          }}
        >

          <h2>
            TOP SUSPICIOUS IPS
          </h2>

          <div
            style={{
              ...glassCard,

              border:
                "1px solid #ef4444",

              boxShadow:
                "0 0 20px rgba(239,68,68,0.3)",
            }}
          >

            {

              Object.entries(
                suspiciousIPs
              ).map(

                ([ip, count],
                  index) => (

                  <p
                    key={index}
                    style={{
                      color: "#ef4444",
                    }}
                  >

                    🔴 {ip}
                    {" "}
                    → Alerts:
                    {" "}
                    {count}

                  </p>

                )

              )

            }

          </div>

        </div>

        {/* LIVE FEED */}

        <div
          style={{
            marginTop: "40px",
          }}
        >

          <h2>
            LIVE TRAFFIC FEED
          </h2>

          {

            traffic.map(
              (item, index) => (

                <div
                  key={index}
                  style={{
                    ...glassCard,

                    border:
                      item.suspicious

                        ? "2px solid #ef4444"

                        : "1px solid #22c55e",

                    boxShadow:
                      item.suspicious

                        ? "0 0 20px rgba(239,68,68,0.4)"

                        : "0 0 10px rgba(34,197,94,0.2)",
                  }}
                >

                  <p>
                    [{item.time}]
                  </p>

                  <p>
                    SOURCE:
                    {" "}
                    {item.source}
                  </p>

                  <p>
                    DESTINATION:
                    {" "}
                    {item.destination}
                  </p>

                  <p>
                    PACKETS:
                    {" "}
                    {item.packet_count}
                  </p>

                  <p>

                    PROTOCOL:

                    <span
                      style={{
                        color:
                          getProtocolColor(
                            item.protocol
                          ),

                        marginLeft:
                          "10px",
                      }}
                    >

                      {item.protocol}

                    </span>

                  </p>

                  <p
                    style={{
                      color:
                        getThreatColor(
                          item.threat_level
                        ),

                      fontWeight:
                        "bold",
                    }}
                  >

                    THREAT LEVEL:
                    {" "}
                    {item.threat_level}

                  </p>

                  <p>
                    AI PREDICTION:
                    {" "}
                    {item.ai_prediction}
                  </p>

                  <p>
                    COUNTRY:
                    {" "}
                    {item.geoInfo?.country}
                  </p>

                  <p>
                    CITY:
                    {" "}
                    {item.geoInfo?.city}
                  </p>

                  <p>
                    ISP:
                    {" "}
                    {item.geoInfo?.isp}
                  </p>

                  {

                    item.suspicious && (

                      <p
                        style={{
                          color:
                            "#ef4444",

                          fontWeight:
                            "bold",

                          marginTop:
                            "10px",
                        }}
                      >

                        ⚠ HIGH THREAT
                        DETECTED

                      </p>

                    )

                  }

                </div>

              )

            )

          }

        </div>

        {/* FOOTER */}

        <div
          style={{

            marginTop: "60px",

            width: "100%",

            background:
              "rgba(0,0,0,0.65)",

            borderTop:
              "1px solid #22c55e",

            display: "flex",

            justifyContent:
              "space-around",

            alignItems: "center",

            flexWrap: "wrap",

            padding: "25px",

            borderRadius: "15px",

            boxShadow:
              "0 0 20px rgba(34,197,94,0.2)",

          }}
        >

          {/* INSTAGRAM */}

          <a
            href="https://instagram.com/saikumar_uthkar"
            target="_blank"
            rel="noreferrer"
            style={footerLink}
          >

            <FaInstagram
              size={35}
              color="#E1306C"
            />

            <span
              style={{
                color: "#E1306C",
              }}
            >
              saikumar_uthkar
            </span>

          </a>

          {/* GITHUB */}

          <a
            href="https://github.com/UTHKARSAI"
            target="_blank"
            rel="noreferrer"
            style={footerLink}
          >

            <FaGithub
              size={35}
              color="#ffffff"
            />

            <span
              style={{
                color: "#ffffff",
              }}
            >
              UTHKARSAI
            </span>

          </a>

          {/* EMAIL */}

          <a
            href="mailto:uthkarsai@gmail.com"
            style={footerLink}
          >

            <FaEnvelope
              size={35}
              color="#22c55e"
            />

            <span
              style={{
                color: "#22c55e",
              }}
            >
              uthkarsai@gmail.com
            </span>

          </a>

        </div>

      </div>

    </div>
  );
}

/* GLASS CARD */

const glassCard = {

  background:
    "rgba(17,24,39,0.75)",

  backdropFilter:
    "blur(10px)",

  border:
    "1px solid #22c55e",

  borderRadius: "15px",

  padding: "20px",

  marginTop: "20px",

  boxShadow:
    "0 0 20px rgba(34,197,94,0.2)",

};

/* STAT CARD */

function StatCard({
  title,
  value,
  color,
}) {

  return (

    <div
      style={{
        background:
          "rgba(17,24,39,0.75)",

        backdropFilter:
          "blur(10px)",

        border:
          `1px solid ${color}`,

        borderRadius: "15px",

        padding: "20px",

        boxShadow:
          `0 0 20px ${color}55`,
      }}
    >

      <h3
        style={{
          color,
        }}
      >
        {title}
      </h3>

      <h1>
        {value}
      </h1>

    </div>

  );
}

/* FOOTER LINKS */

const footerLink = {

  display: "flex",

  alignItems: "center",

  gap: "12px",

  textDecoration: "none",

  fontSize: "18px",

  fontWeight: "bold",

};

export default App;
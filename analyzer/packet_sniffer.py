from scapy.all import sniff, IP
from collections import defaultdict

import socketio
import datetime
import os

# Socket connection with auto reconnect

sio = socketio.Client(
    reconnection=True
)

sio.connect("http://localhost:5000")

print("Connected To Backend")

# Create CSV header if file doesn't exist

if not os.path.exists(
    "attack_logs.csv"
):

    with open(
        "attack_logs.csv",
        "w"
    ) as log_file:

        log_file.write(
            "TIME,SOURCE,"
            "DESTINATION,"
            "PROTOCOL,"
            "THREAT_LEVEL,"
            "AI_PREDICTION\n"
        )

# Store packet counts
ip_counter = defaultdict(int)

def get_protocol(proto):

    if proto == 6:
        return "TCP"

    elif proto == 17:
        return "UDP"

    elif proto == 1:
        return "ICMP"

    return "OTHER"

def ai_prediction(packet_count):

    if packet_count > 150:

        return "Possible Flood Attack"

    elif packet_count > 100:

        return "Possible Port Scan"

    elif packet_count > 50:

        return "Suspicious Activity"

    else:

        return "Normal Traffic"

def get_threat_level(packet_count):

    if packet_count > 150:

        return "HIGH"

    elif packet_count > 100:

        return "MEDIUM"

    elif packet_count > 50:

        return "LOW"

    return "SAFE"

def process_packet(packet):

    if packet.haslayer(IP):

        src = packet[IP].src

        dst = packet[IP].dst

        protocol = get_protocol(
            packet[IP].proto
        )

        # Count packets from source IP

        ip_counter[src] += 1

        packet_count = ip_counter[src]

        # AI prediction

        ai_result = ai_prediction(
            packet_count
        )

        # Threat level

        threat_level = get_threat_level(
            packet_count
        )

        # Suspicious traffic detection

        suspicious = (
            packet_count > 50
        )

        data = {

            "source": src,

            "destination": dst,

            "protocol": protocol,

            "packet_count":
                packet_count,

            "threat_level":
                threat_level,

            "ai_prediction":
                ai_result,

            "suspicious":
                suspicious,

            "time":
                datetime.datetime.now().strftime(
                    "%H:%M:%S"
                )

        }

        # Save suspicious traffic logs

        if suspicious:

            with open(
                "attack_logs.csv",
                "a"
            ) as log_file:

                log_file.write(

                    f"{data['time']},"

                    f"{src},"

                    f"{dst},"

                    f"{protocol},"

                    f"{threat_level},"

                    f"{ai_result}\n"

                )

        print(data)

        # Send data safely to backend

        if sio.connected:

            sio.emit(
                "traffic-data",
                data
            )

print(
    "\nCipherNet Sentinel Started...\n"
)

# Start packet sniffing

sniff(
    prn=process_packet,
    store=False
)
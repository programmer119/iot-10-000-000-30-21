import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  CloudSun,
  Cpu,
  Droplets,
  Factory,
  Gauge,
  RadioTower,
  RefreshCw,
  Router,
  ShieldCheck,
  Thermometer,
  Wifi,
  Zap
} from 'lucide-react';
import './styles.css';

const sites = [
  {
    id: 'plant-a',
    name: 'Plant A',
    place: '성남 스마트팩토리',
    accent: '#1e9b7a',
    online: 128,
    warning: 4,
    power: 84,
    temp: 27.4,
    humidity: 43,
    series: [62, 68, 71, 77, 73, 82, 88, 84, 91, 86, 94, 97]
  },
  {
    id: 'cold-chain',
    name: 'Cold Chain',
    place: '냉장 물류 센터',
    accent: '#3478f6',
    online: 96,
    warning: 2,
    power: 76,
    temp: 3.2,
    humidity: 61,
    series: [42, 49, 46, 55, 58, 64, 69, 67, 72, 78, 74, 81]
  },
  {
    id: 'energy-hub',
    name: 'Energy Hub',
    place: '분산 전력 관제',
    accent: '#e59b2d',
    online: 212,
    warning: 9,
    power: 91,
    temp: 31.8,
    humidity: 38,
    series: [73, 75, 82, 79, 86, 92, 88, 95, 91, 97, 94, 99]
  }
];

const devices = [
  { name: 'Gateway-01', type: 'MQTT', health: 98, icon: Router },
  { name: 'Temp Sensor', type: 'LoRa', health: 91, icon: Thermometer },
  { name: 'Power Meter', type: 'Modbus', health: 87, icon: Zap },
  { name: 'Edge CPU', type: 'Linux', health: 74, icon: Cpu }
];

function pathFor(values) {
  return values
    .map((value, index) => {
      const x = 16 + index * 34;
      const y = 132 - value;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function App() {
  const [siteId, setSiteId] = useState('plant-a');
  const [tick, setTick] = useState(2);
  const site = sites.find((item) => item.id === siteId);

  const liveSeries = useMemo(
    () => site.series.map((value, index) => Math.min(100, Math.max(30, value + Math.sin((tick + index) / 1.8) * 5))),
    [site, tick]
  );

  return (
    <main className="iot-shell" style={{ '--accent': site.accent }}>
      <section className="console">
        <aside className="side">
          <div className="brand">
            <RadioTower size={24} />
            <span>IoT Control</span>
          </div>
          <div className="site-list">
            {sites.map((item) => (
              <button
                key={item.id}
                type="button"
                className={siteId === item.id ? 'site active' : 'site'}
                onClick={() => setSiteId(item.id)}
              >
                <strong>{item.name}</strong>
                <span>{item.place}</span>
              </button>
            ))}
          </div>
          <div className="network-card">
            <Wifi size={26} />
            <strong>Network Stable</strong>
            <p>Edge gateway, sensor mesh, cloud pipeline status synchronized.</p>
          </div>
        </aside>

        <section className="stage">
          <header className="topbar">
            <div>
              <span>Real-time Device Monitoring</span>
              <h1>{site.place}</h1>
            </div>
            <button type="button" onClick={() => setTick((value) => value + 1)}>
              <RefreshCw size={19} />
              Sync
            </button>
          </header>

          <section className="hero">
            <div>
              <span>Live Operations</span>
              <h2>센서, 게이트웨이, 전력 상태를 한 화면에서 관제</h2>
              <p>현장 장비의 연결 상태와 이상 신호를 실시간 대시보드로 확인하는 IoT 웹 콘솔입니다.</p>
            </div>
            <div className="status-pill">
              <CheckCircle2 size={24} />
              <strong>{site.online}</strong>
              <span>devices online</span>
            </div>
          </section>

          <section className="metric-grid">
            <article>
              <Thermometer size={24} />
              <span>Temperature</span>
              <strong>{site.temp}°C</strong>
            </article>
            <article>
              <Droplets size={24} />
              <span>Humidity</span>
              <strong>{site.humidity}%</strong>
            </article>
            <article>
              <BatteryCharging size={24} />
              <span>Power Load</span>
              <strong>{site.power}%</strong>
            </article>
            <article className={site.warning > 5 ? 'warn' : ''}>
              <AlertTriangle size={24} />
              <span>Warnings</span>
              <strong>{site.warning}</strong>
            </article>
          </section>

          <section className="dashboard">
            <article className="panel chart-panel">
              <div className="panel-head">
                <div>
                  <span>Telemetry Flow</span>
                  <h2>수집 데이터 추세</h2>
                </div>
                <Activity size={23} />
              </div>
              <svg viewBox="0 0 420 150" className="trend-chart" role="img" aria-label="Telemetry trend chart">
                {[38, 72, 106].map((line) => (
                  <line key={line} x1="16" x2="402" y1={line} y2={line} />
                ))}
                <path className="area" d={`${pathFor(liveSeries)} L 402 142 L 16 142 Z`} />
                <path className="line" d={pathFor(liveSeries)} />
                {liveSeries.map((value, index) => (
                  <circle key={index} cx={16 + index * 34} cy={132 - value} r={index === tick % 12 ? 6 : 4} />
                ))}
              </svg>
            </article>

            <article className="panel map-panel">
              <div className="panel-head">
                <div>
                  <span>Device Map</span>
                  <h2>현장 노드 상태</h2>
                </div>
                <Factory size={23} />
              </div>
              <div className="node-map">
                {Array.from({ length: 15 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={(index + tick) % 7 === 0 ? 'node alert' : 'node'}
                    aria-label={`node ${index + 1}`}
                  />
                ))}
              </div>
            </article>

            <article className="panel device-panel">
              <div className="panel-head">
                <div>
                  <span>Edge Devices</span>
                  <h2>장비 헬스 체크</h2>
                </div>
                <ShieldCheck size={23} />
              </div>
              <div className="device-list">
                {devices.map((device, index) => {
                  const Icon = device.icon;
                  const health = Math.max(58, Math.min(99, device.health + Math.round(Math.sin(tick + index) * 4)));
                  return (
                    <div className="device" key={device.name}>
                      <Icon size={21} />
                      <div>
                        <strong>{device.name}</strong>
                        <span>{device.type}</span>
                      </div>
                      <b>{health}%</b>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="panel weather-panel">
              <div className="panel-head">
                <div>
                  <span>Environment</span>
                  <h2>외부 환경</h2>
                </div>
                <CloudSun size={23} />
              </div>
              <div className="gauge">
                <Gauge size={58} />
                <strong>{site.power}</strong>
                <span>facility efficiency</span>
              </div>
            </article>
          </section>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

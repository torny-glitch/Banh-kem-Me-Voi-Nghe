import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

/* =========================================================
   1. CẤU HÌNH TIỆM – sửa thông tin thật của bạn ở đây
   ========================================================= */
const SHOP = {
  name: 'Tiệm bánh Mẹ Voi Nghé',
  phone: '0900 000 000', // TODO: thay số điện thoại thật
  zalo: '0900000000', // số Zalo, viết liền không dấu cách
  address: 'Số 00, Đường ABC, Quận XYZ, Hà Nội', // TODO: thay địa chỉ thật
  hours: '8:00 – 21:00, tất cả các ngày',
  email: 'hello@tiembanhmevoinghe.vn',
  facebook: 'https://facebook.com/', // TODO: link fanpage
  mapUrl: 'https://maps.google.com/?q=Ha+Noi', // TODO: link Google Maps
  shipFee: 20000, // phí giao hàng nội thành
  freeShipFrom: 300000, // miễn phí giao từ mức này
  leadTime: 'Bánh nhỏ và bánh cuộn giao trong ngày. Bánh kem nguyên cái vui lòng đặt trước 1 ngày.',
  bank: {
    name: 'Ngân hàng MSB', // TODO
    number: '0000 0000 0000', // TODO
    holder: 'TEN CHU TAI KHOAN', // TODO
  },
  // Nếu muốn nhận đơn tự động (Formspree, Google Apps Script, webhook...),
  // dán URL vào đây. Để trống = đơn chỉ hiện trên màn hình để khách gửi qua Zalo.
  orderEndpoint: '',
}

/* =========================================================
   2. DANH MỤC SẢN PHẨM (20 dòng bánh) – giá tính bằng đồng
   type: roll | cup | whole | cupcake | brownie | cookie | slice
   c1 = màu thân bánh, c2 = màu kem/nhân, c3 = màu phủ/điểm nhấn
   ========================================================= */
const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cuon', label: 'Bánh cuộn' },
  { id: 'lanh', label: 'Bánh lạnh' },
  { id: 'kem', label: 'Bánh kem' },
  { id: 'nho', label: 'Bánh nhỏ' },
]

const PRODUCTS = [
  // Bánh cuộn
  { id: 'cuon-socola', cat: 'cuon', name: 'Cuộn Socola', price: 55000, unit: 'phần', tag: 'Bán chạy', desc: 'Thân bánh cacao mềm, kem socola mịn, phủ ganache và vụn socola.', type: 'roll', c1: '#5a3020', c2: '#8a5236', c3: '#3d2016' },
  { id: 'cuon-vani', cat: 'cuon', name: 'Cuộn Vani', price: 55000, unit: 'phần', tag: 'Bán chạy', desc: 'Bông lan vani thơm, kem tươi béo nhẹ, điểm một quả dâu.', type: 'roll', c1: '#f3c97d', c2: '#fff6e6', c3: '#e8453c' },
  { id: 'cuon-tra-xanh', cat: 'cuon', name: 'Cuộn Trà xanh', price: 55000, unit: 'phần', desc: 'Matcha thơm dịu, vị đắng nhẹ cân bằng với kem sữa.', type: 'roll', c1: '#9db56a', c2: '#f4f0d8', c3: '#6f8c3c' },
  { id: 'cuon-ca-phe', cat: 'cuon', name: 'Cuộn Cà phê', price: 55000, unit: 'phần', desc: 'Bông lan cà phê, kem mascarpone, dành cho người mê vị đậm.', type: 'roll', c1: '#a8744a', c2: '#f1dcc0', c3: '#6b3a22' },
  { id: 'cuon-dau', cat: 'cuon', name: 'Cuộn Dâu', price: 55000, unit: 'phần', desc: 'Kem dâu tươi hồng nhạt, chua ngọt vừa phải.', type: 'roll', c1: '#f2b7b0', c2: '#fff1ee', c3: '#e8453c' },

  // Bánh lạnh
  { id: 'tiramisu', cat: 'lanh', name: 'Tiramisu', price: 70000, unit: 'hũ', tag: 'Bán chạy', desc: 'Bánh ladyfinger tẩm cà phê, kem mascarpone, rắc cacao.', type: 'cup', c1: '#b98255', c2: '#fbeccb', c3: '#6b3a22' },
  { id: 'panna-cotta-xoai', cat: 'lanh', name: 'Panna cotta Xoài', price: 45000, unit: 'hũ', desc: 'Kem sữa mềm tan, lớp xoài chín ở trên.', type: 'cup', c1: '#fbeccb', c2: '#fff6e6', c3: '#f6a623' },
  { id: 'cheesecake-chanh-day', cat: 'lanh', name: 'Cheesecake Chanh dây', price: 65000, unit: 'phần', desc: 'Phô mai béo mịn, sốt chanh dây chua thanh.', type: 'slice', c1: '#e8b26a', c2: '#fff1c9', c3: '#f6a623' },
  { id: 'mousse-socola', cat: 'lanh', name: 'Mousse Socola', price: 55000, unit: 'hũ', desc: 'Socola đen mềm xốp, ít ngọt, đậm vị cacao.', type: 'cup', c1: '#6b3a22', c2: '#8a5236', c3: '#3d2016' },
  { id: 'flan-caramel', cat: 'lanh', name: 'Bánh flan Caramel', price: 25000, unit: 'cái', desc: 'Flan trứng sữa mịn, caramel đắng nhẹ.', type: 'cup', c1: '#f3c97d', c2: '#fbd98a', c3: '#a8541f' },

  // Bánh kem nguyên cái
  { id: 'kem-dau-16', cat: 'kem', name: 'Bánh kem Dâu 16cm', price: 280000, unit: 'cái', desc: 'Bông lan vani, kem tươi, dâu phủ mặt. Phù hợp 4–6 người.', type: 'whole', c1: '#fff1c9', c2: '#fffaf0', c3: '#e8453c' },
  { id: 'red-velvet-16', cat: 'kem', name: 'Red Velvet 16cm', price: 320000, unit: 'cái', tag: 'Mới', desc: 'Cốt đỏ nhung, kem phô mai, lớp trang trí vụn bánh.', type: 'whole', c1: '#b23a3a', c2: '#fff6e6', c3: '#8c2424' },
  { id: 'socola-truffle-16', cat: 'kem', name: 'Socola Truffle 16cm', price: 300000, unit: 'cái', desc: 'Nhiều lớp socola, ganache bóng, phủ cacao.', type: 'whole', c1: '#5a3020', c2: '#8a5236', c3: '#3d2016' },
  { id: 'tiramisu-18', cat: 'kem', name: 'Tiramisu khay 18cm', price: 350000, unit: 'khay', desc: 'Tiramisu nguyên khay để chia sẻ, đặt trước 1 ngày.', type: 'whole', c1: '#b98255', c2: '#fbeccb', c3: '#6b3a22' },
  { id: 'chanh-day-16', cat: 'kem', name: 'Bông lan Chanh dây 16cm', price: 290000, unit: 'cái', desc: 'Kem chanh dây thơm, vị chua nhẹ, không ngấy.', type: 'whole', c1: '#f6d27a', c2: '#fffaf0', c3: '#f6a623' },

  // Bánh nhỏ
  { id: 'cupcake-vani', cat: 'nho', name: 'Cupcake Vani', price: 30000, unit: 'cái', desc: 'Cốt vani xốp nhẹ, kem bơ vani.', type: 'cupcake', c1: '#f3c97d', c2: '#fff1c9', c3: '#f2b7b0' },
  { id: 'cupcake-socola', cat: 'nho', name: 'Cupcake Socola', price: 30000, unit: 'cái', desc: 'Cốt cacao ẩm, kem socola đậm.', type: 'cupcake', c1: '#8a5236', c2: '#6b3a22', c3: '#f6d27a' },
  { id: 'brownie', cat: 'nho', name: 'Brownie Socola', price: 35000, unit: 'miếng', desc: 'Vỏ mỏng, ruột dẻo, nhiều socola.', type: 'brownie', c1: '#4a2a1a', c2: '#6b3a22', c3: '#8a5236' },
  { id: 'muffin-viet-quat', cat: 'nho', name: 'Muffin Việt quất', price: 35000, unit: 'cái', desc: 'Muffin bơ sữa, việt quất nguyên quả.', type: 'cupcake', c1: '#e8b26a', c2: '#f3c97d', c3: '#5b5fa8' },
  { id: 'cookie-socola', cat: 'nho', name: 'Cookie Socola chip', price: 25000, unit: 'cái', desc: 'Giòn viền, mềm giữa, nhiều chip socola.', type: 'cookie', c1: '#d9a164', c2: '#6b3a22', c3: '#8a5236' },
]

const SIGNATURE = ['cuon-socola', 'cuon-vani', 'tiramisu']

/* =========================================================
   3. TIỆN ÍCH
   ========================================================= */
const fmt = (n) => n.toLocaleString('vi-VN') + 'đ'
const telHref = (p) => 'tel:' + p.replace(/\s/g, '')
const CART_KEY = 'mevoinghe-cart-v1'
const PHONE_RE = /^(0|\+84)\d{9,10}$/

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {}
  } catch {
    return {}
  }
}

function makeOrderCode() {
  const d = new Date()
  const p = (x) => String(x).padStart(2, '0')
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `MVN-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rnd}`
}

/* =========================================================
   4. HÌNH MINH HỌA BÁNH (SVG, không cần ảnh)
   Muốn dùng ảnh thật: thêm `img: '/images/ten-file.jpg'` vào sản phẩm
   và bỏ ảnh vào thư mục public/images/
   ========================================================= */
function CakeArt({ p }) {
  const { type, c1, c2, c3 } = p
  return (
    <svg viewBox="0 0 120 100" className="cake-art" role="img" aria-label={p.name}>
      {type !== 'cookie' && <ellipse cx="60" cy="86" rx="46" ry="9" fill="#fff" stroke="#e9d9bd" strokeWidth="1.5" />}
      {type === 'roll' && (
        <g>
          <path d="M20 78 Q18 44 52 36 Q92 30 100 62 L100 78 Q60 90 20 78Z" fill={c1} />
          <ellipse cx="46" cy="58" rx="26" ry="24" fill={c1} stroke="rgba(0,0,0,.12)" />
          <ellipse cx="46" cy="58" rx="19" ry="17.5" fill={c2} />
          <path d="M46 58 m-3 0 a3 3 0 1 1 6 0 a8 7 0 1 1 -12 0 a13 12 0 1 1 22 0" fill="none" stroke={c1} strokeWidth="3" strokeLinecap="round" />
          <circle cx="64" cy="34" r="8" fill={c2} />
          <circle cx="64" cy="29" r="5.5" fill={c3} />
        </g>
      )}
      {type === 'cup' && (
        <g>
          <rect x="30" y="30" width="60" height="50" rx="6" fill="#fffaf0" stroke="#e0cfae" strokeWidth="2" />
          <rect x="33" y="33" width="54" height="12" rx="3" fill={c3} />
          <rect x="33" y="45" width="54" height="9" fill={c2} />
          <rect x="33" y="54" width="54" height="10" fill={c1} />
          <rect x="33" y="64" width="54" height="13" rx="3" fill={c2} />
          <circle cx="52" cy="28" r="4" fill={c3} />
          <circle cx="62" cy="27" r="4" fill={c3} />
          <path d="M66 24 q6 -10 12 -2 q-6 6 -12 2z" fill="#6f8c3c" />
        </g>
      )}
      {type === 'slice' && (
        <g>
          <path d="M22 78 L98 78 L84 38 L22 38Z" fill={c1} />
          <path d="M22 38 L84 38 L98 78" fill="none" stroke="rgba(0,0,0,.1)" />
          <rect x="22" y="60" width="76" height="18" fill="#e9c88f" />
          <rect x="22" y="50" width="62" height="10" fill={c2} />
          <path d="M22 38 L84 38 L90 50 L22 50Z" fill={c3} opacity=".9" />
        </g>
      )}
      {type === 'whole' && (
        <g>
          <path d="M22 50 L22 78 Q60 94 98 78 L98 50Z" fill={c1} />
          <path d="M22 62 Q60 76 98 62" fill="none" stroke={c2} strokeWidth="5" />
          <ellipse cx="60" cy="50" rx="38" ry="14" fill={c2} />
          <ellipse cx="60" cy="48" rx="30" ry="9" fill={c3} opacity=".85" />
          {[34, 46, 60, 74, 86].map((x, i) => (
            <circle key={x} cx={x} cy={64 + (i % 2) * 6} r="5" fill={c2} />
          ))}
          <circle cx="60" cy="38" r="6" fill={c3} />
          <path d="M60 32 q4 -8 9 -4" fill="none" stroke="#6f8c3c" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {type === 'cupcake' && (
        <g>
          <path d="M36 54 L84 54 L78 82 L42 82Z" fill="#f2b7b0" stroke="#e8453c" strokeOpacity=".25" />
          {[46, 54, 62, 70, 76].map((x) => (
            <line key={x} x1={x} y1="54" x2={x - 1 + (x > 60 ? 2 : -2)} y2="82" stroke="#fff" strokeOpacity=".5" />
          ))}
          <path d="M32 54 Q30 34 60 32 Q90 34 88 54Z" fill={c1} />
          <path d="M40 40 Q60 22 80 40 Q60 48 40 40Z" fill={c2} />
          <circle cx="60" cy="26" r="6" fill={c3} />
          <circle cx="50" cy="44" r="2.5" fill={c3} />
          <circle cx="72" cy="46" r="2.5" fill={c3} />
        </g>
      )}
      {type === 'brownie' && (
        <g>
          <path d="M28 52 L84 46 L96 62 L96 80 L40 86 L28 70Z" fill={c1} />
          <path d="M28 52 L84 46 L96 62 L40 68Z" fill={c2} />
          <path d="M40 68 L96 62 L96 80 L40 86Z" fill={c1} opacity=".85" />
          {[[50, 56], [68, 54], [80, 58], [58, 62]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="2.4" fill={c3} />
          ))}
        </g>
      )}
      {type === 'cookie' && (
        <g>
          <ellipse cx="60" cy="78" rx="38" ry="6" fill="rgba(107,58,34,.12)" />
          <circle cx="60" cy="54" r="30" fill={c1} stroke="rgba(0,0,0,.12)" strokeWidth="1.5" />
          {[[48, 44], [66, 40], [74, 58], [52, 62], [62, 70], [40, 58], [70, 48]].map(([x, y]) => (
            <ellipse key={x + '-' + y} cx={x} cy={y} rx="5" ry="4" fill={c2} />
          ))}
        </g>
      )}
    </svg>
  )
}

function Elephant() {
  return (
    <svg viewBox="0 0 160 170" className="elephant" role="img" aria-label="Mẹ Voi">
      <g stroke="#8a5236" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <ellipse cx="30" cy="96" rx="26" ry="34" fill="#cfc8c0" />
        <ellipse cx="130" cy="96" rx="26" ry="34" fill="#cfc8c0" />
        <circle cx="80" cy="96" r="48" fill="#ded8d1" />
        <path d="M70 118 Q70 150 84 152 Q98 152 92 138" fill="none" stroke="#8a5236" strokeWidth="18" />
        <path d="M70 118 Q70 150 84 152 Q98 152 92 138" fill="none" stroke="#ded8d1" strokeWidth="12" />
        <path d="M44 40 Q40 14 66 18 Q72 4 92 14 Q116 8 116 36 Q116 46 104 46 L56 46 Q44 46 44 40Z" fill="#fffaf0" />
        <rect x="52" y="44" width="56" height="10" rx="3" fill="#fffaf0" />
      </g>
      <path d="M58 92 q7 -8 14 0" fill="none" stroke="#6b3a22" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M90 92 q7 -8 14 0" fill="none" stroke="#6b3a22" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="52" cy="108" r="8" fill="#f4a59a" opacity=".75" />
      <circle cx="108" cy="108" r="8" fill="#f4a59a" opacity=".75" />
    </svg>
  )
}

/* =========================================================
   5. CÁC KHỐI GIAO DIỆN
   ========================================================= */
function Awning() {
  return (
    <div className="awning" aria-hidden="true">
      {Array.from({ length: 32 }).map((_, i) => (
        <span key={i} className={i % 2 ? 'cream' : 'orange'} />
      ))}
    </div>
  )
}

function Header({ count, onCart }) {
  return (
    <header className="header">
      <a href="#top" className="brand">
        <span className="brand-hat" aria-hidden="true">👨‍🍳</span>
        <span>Mẹ Voi Nghé</span>
      </a>
      <nav className="nav" aria-label="Điều hướng">
        <a href="#menu">Thực đơn</a>
        <a href="#about">Về tiệm</a>
        <a href="#contact">Liên hệ</a>
      </nav>
      <button className="cart-btn" onClick={onCart} aria-label={`Mở giỏ hàng, ${count} món`}>
        <span aria-hidden="true">🛒</span>
        <span className="cart-label">Giỏ hàng</span>
        {count > 0 && <b className="badge">{count}</b>}
      </button>
    </header>
  )
}

function Hero({ onAdd }) {
  const sig = SIGNATURE.map((id) => PRODUCTS.find((p) => p.id === id))
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="title-blob">
            <span className="title-small">Tiệm bánh</span>
            <h1>Mẹ Voi Nghé</h1>
          </div>
          <p className="lead">
            Bánh cuộn mềm, tiramisu béo mịn và bánh kem làm thủ công mỗi ngày. Chọn bánh, bỏ vào giỏ, đặt hàng trong vài phút.
          </p>
          <div className="hero-cta">
            <a className="btn primary" href="#menu">Chọn bánh ngay</a>
            <a className="btn ghost" href={telHref(SHOP.phone)}>Gọi {SHOP.phone}</a>
          </div>
        </div>
        <div className="hero-mascot" aria-hidden="true">
          <Elephant />
        </div>
      </div>

      <ul className="signature">
        {sig.map((p) => (
          <li key={p.id} className="sig-card">
            <div className="sig-art"><CakeArt p={p} /></div>
            <span className="brush">{p.name}</span>
            <span className="price-pill">{p.price / 1000}k</span>
            <button className="btn small primary" onClick={() => onAdd(p.id)}>Thêm vào giỏ</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ProductCard({ p, qty, onAdd }) {
  return (
    <article className="card">
      {p.tag && <span className="ribbon">{p.tag}</span>}
      <div className="card-art">
        {p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <CakeArt p={p} />}
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="desc">{p.desc}</p>
        <div className="card-foot">
          <div className="price">
            {fmt(p.price)}
            <small>/{p.unit}</small>
          </div>
          <button className="btn small primary" onClick={() => onAdd(p.id)}>
            {qty > 0 ? `Thêm (${qty})` : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </article>
  )
}

function Menu({ cart, onAdd }) {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return PRODUCTS.filter((p) => (cat === 'all' || p.cat === cat) && (!kw || p.name.toLowerCase().includes(kw)))
  }, [cat, q])

  return (
    <section className="section" id="menu">
      <div className="section-head">
        <h2>Thực đơn hôm nay</h2>
        <p>{PRODUCTS.length} loại bánh. {SHOP.leadTime}</p>
      </div>

      <div className="toolbar">
        <div className="chips" role="tablist" aria-label="Nhóm bánh">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              className={'chip' + (cat === c.id ? ' on' : '')}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="search"
          placeholder="Tìm tên bánh..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Tìm bánh theo tên"
        />
      </div>

      {list.length === 0 ? (
        <p className="empty">Không có bánh nào tên “{q}”. Thử từ khóa khác hoặc chọn nhóm “Tất cả”.</p>
      ) : (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} qty={cart[p.id] || 0} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  )
}

function About() {
  const items = [
    { t: 'Làm mới mỗi ngày', d: 'Bánh được làm trong ngày, không dùng chất bảo quản.' },
    { t: 'Ít ngọt, thơm bơ sữa', d: 'Công thức vừa miệng cho cả người lớn và trẻ nhỏ.' },
    { t: 'Đóng hộp cẩn thận', d: 'Bánh lạnh có túi giữ nhiệt khi giao.' },
  ]
  return (
    <section className="section about" id="about">
      <div className="about-wrap">
        <div className="about-mascot" aria-hidden="true"><Elephant /></div>
        <div>
          <h2>Về tiệm Mẹ Voi Nghé</h2>
          <p className="lead">
            Mẹ Voi và bé Nghé cùng đứng bếp: làm những chiếc bánh giản dị, đủ ngon để mang về nhà chia cho cả gia đình.
          </p>
          <ul className="points">
            {items.map((i) => (
              <li key={i.t}>
                <b>{i.t}</b>
                <span>{i.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="section-head">
        <h2>Cần hỗ trợ? Liên hệ tiệm</h2>
        <p>Đặt bánh theo yêu cầu, đổi giờ giao hay hỏi về nguyên liệu, cứ nhắn hoặc gọi cho tiệm.</p>
      </div>
      <div className="contact-grid">
        <a className="contact-card" href={telHref(SHOP.phone)}>
          <span className="ci" aria-hidden="true">📞</span>
          <b>Điện thoại</b>
          <span>{SHOP.phone}</span>
        </a>
        <a className="contact-card" href={`https://zalo.me/${SHOP.zalo}`} target="_blank" rel="noreferrer">
          <span className="ci" aria-hidden="true">💬</span>
          <b>Nhắn Zalo</b>
          <span>{SHOP.phone}</span>
        </a>
        <a className="contact-card" href={SHOP.mapUrl} target="_blank" rel="noreferrer">
          <span className="ci" aria-hidden="true">📍</span>
          <b>Địa chỉ</b>
          <span>{SHOP.address}</span>
        </a>
        <div className="contact-card static">
          <span className="ci" aria-hidden="true">🕗</span>
          <b>Giờ mở cửa</b>
          <span>{SHOP.hours}</span>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <Awning />
      <div className="footer-inner">
        <b>{SHOP.name}</b>
        <span>{SHOP.address}</span>
        <span>
          <a href={telHref(SHOP.phone)}>{SHOP.phone}</a> · <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a> ·{' '}
          <a href={SHOP.facebook} target="_blank" rel="noreferrer">Facebook</a>
        </span>
        <small>© {new Date().getFullYear()} {SHOP.name}</small>
      </div>
    </footer>
  )
}

/* ---------- Giỏ hàng ---------- */
function calcTotals(cart, delivery) {
  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id), qty }))
    .filter((l) => l.p && l.qty > 0)
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0)
  const fee = delivery === 'ship' && subtotal > 0 && subtotal < SHOP.freeShipFrom ? SHOP.shipFee : 0
  return { lines, subtotal, fee, total: subtotal + fee }
}

function Drawer({ open, onClose, cart, setQty, onCheckout }) {
  const { lines, subtotal } = calcTotals(cart, 'pickup')
  const remain = SHOP.freeShipFrom - subtotal
  return (
    <>
      <div className={'overlay' + (open ? ' show' : '')} onClick={onClose} />
      <aside className={'drawer' + (open ? ' open' : '')} aria-hidden={!open} role="dialog" aria-label="Giỏ hàng">
        <div className="drawer-head">
          <h2>Giỏ hàng của bạn</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng giỏ hàng">✕</button>
        </div>

        {lines.length === 0 ? (
          <div className="empty big">
            <p>Giỏ hàng đang trống.</p>
            <a className="btn primary" href="#menu" onClick={onClose}>Xem thực đơn</a>
          </div>
        ) : (
          <>
            <ul className="lines">
              {lines.map(({ p, qty }) => (
                <li key={p.id} className="line">
                  <div className="line-art"><CakeArt p={p} /></div>
                  <div className="line-info">
                    <b>{p.name}</b>
                    <span>{fmt(p.price)}/{p.unit}</span>
                    <div className="stepper">
                      <button onClick={() => setQty(p.id, qty - 1)} aria-label={`Giảm ${p.name}`}>−</button>
                      <span aria-live="polite">{qty}</span>
                      <button onClick={() => setQty(p.id, qty + 1)} aria-label={`Tăng ${p.name}`}>+</button>
                    </div>
                  </div>
                  <div className="line-sum">
                    {fmt(p.price * qty)}
                    <button className="link" onClick={() => setQty(p.id, 0)}>Xóa</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              {remain > 0 ? (
                <p className="hint">Mua thêm {fmt(remain)} để được miễn phí giao hàng.</p>
              ) : (
                <p className="hint ok">Đơn của bạn được miễn phí giao hàng.</p>
              )}
              <div className="row"><span>Tạm tính</span><b>{fmt(subtotal)}</b></div>
              <button className="btn primary wide" onClick={onCheckout}>Đặt hàng</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

/* ---------- Thanh toán ---------- */
function Checkout({ cart, onClose, onDone }) {
  const [f, setF] = useState({ name: '', phone: '', address: '', note: '', delivery: 'ship', pay: 'cod' })
  const [err, setErr] = useState({})
  const [order, setOrder] = useState(null)
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)

  const t = calcTotals(cart, f.delivery)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  function validate() {
    const e = {}
    if (f.name.trim().length < 2) e.name = 'Vui lòng nhập họ tên.'
    if (!PHONE_RE.test(f.phone.replace(/[\s.]/g, ''))) e.phone = 'Số điện thoại chưa đúng (ví dụ 0912345678).'
    if (f.delivery === 'ship' && f.address.trim().length < 6) e.address = 'Vui lòng nhập địa chỉ nhận bánh.'
    setErr(e)
    return Object.keys(e).length === 0
  }

  function orderText(o) {
    const lines = o.lines.map((l) => `- ${l.p.name} x${l.qty}: ${fmt(l.p.price * l.qty)}`).join('\n')
    return [
      `ĐƠN HÀNG ${o.code}`,
      lines,
      `Tạm tính: ${fmt(o.subtotal)}`,
      `Phí giao: ${fmt(o.fee)}`,
      `Tổng cộng: ${fmt(o.total)}`,
      `Nhận bánh: ${o.f.delivery === 'ship' ? 'Giao tận nơi – ' + o.f.address : 'Đến lấy tại tiệm'}`,
      `Thanh toán: ${o.f.pay === 'cod' ? 'Tiền mặt khi nhận bánh' : 'Chuyển khoản'}`,
      `Khách: ${o.f.name} – ${o.f.phone}`,
      o.f.note ? `Ghi chú: ${o.f.note}` : '',
    ].filter(Boolean).join('\n')
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    const o = { code: makeOrderCode(), lines: t.lines, subtotal: t.subtotal, fee: t.fee, total: t.total, f: { ...f } }
    if (SHOP.orderEndpoint) {
      try {
        await fetch(SHOP.orderEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: o.code, text: orderText(o), customer: f, total: o.total }),
        })
      } catch {
        /* lỗi mạng: vẫn cho khách gửi đơn qua Zalo */
      }
    }
    setSending(false)
    setOrder(o)
    onDone()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(orderText(order))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Thanh toán">
      <div className="modal-bg" onClick={onClose} />
      <div className="modal">
        <button className="icon-btn close" onClick={onClose} aria-label="Đóng">✕</button>

        {order ? (
          <div className="done">
            <div className="done-badge" aria-hidden="true">✓</div>
            <h2>Tiệm đã nhận đơn của bạn</h2>
            <p>Mã đơn: <b className="code">{order.code}</b></p>
            <p className="muted">
              {SHOP.orderEndpoint
                ? 'Tiệm sẽ gọi xác nhận trong ít phút.'
                : 'Để tiệm xử lý nhanh, hãy gửi nội dung đơn qua Zalo hoặc gọi điện cho tiệm.'}
            </p>
            <pre className="summary">{orderText(order)}</pre>
            {order.f.pay === 'bank' && (
              <div className="bank">
                <b>Thông tin chuyển khoản</b>
                <span>{SHOP.bank.name} – {SHOP.bank.number}</span>
                <span>Chủ TK: {SHOP.bank.holder}</span>
                <span>Nội dung: {order.code}</span>
              </div>
            )}
            <div className="done-actions">
              <button className="btn ghost" onClick={copy}>{copied ? 'Đã sao chép' : 'Sao chép đơn'}</button>
              <a className="btn primary" href={`https://zalo.me/${SHOP.zalo}`} target="_blank" rel="noreferrer">Gửi qua Zalo</a>
              <a className="btn ghost" href={telHref(SHOP.phone)}>Gọi tiệm</a>
            </div>
            <button className="link center" onClick={onClose}>Đóng</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2>Thông tin đặt hàng</h2>

            <div className="form-grid">
              <label>
                Họ và tên
                <input value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!err.name} />
                {err.name && <em className="err">{err.name}</em>}
              </label>
              <label>
                Số điện thoại
                <input value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" aria-invalid={!!err.phone} />
                {err.phone && <em className="err">{err.phone}</em>}
              </label>
            </div>

            <fieldset>
              <legend>Cách nhận bánh</legend>
              <label className="radio">
                <input type="radio" name="delivery" checked={f.delivery === 'ship'} onChange={() => setF({ ...f, delivery: 'ship' })} />
                <span>Giao tận nơi <small>(phí {fmt(SHOP.shipFee)}, miễn phí từ {fmt(SHOP.freeShipFrom)})</small></span>
              </label>
              <label className="radio">
                <input type="radio" name="delivery" checked={f.delivery === 'pickup'} onChange={() => setF({ ...f, delivery: 'pickup' })} />
                <span>Đến lấy tại tiệm <small>({SHOP.address})</small></span>
              </label>
            </fieldset>

            {f.delivery === 'ship' && (
              <label>
                Địa chỉ nhận bánh
                <input value={f.address} onChange={set('address')} autoComplete="street-address" aria-invalid={!!err.address} />
                {err.address && <em className="err">{err.address}</em>}
              </label>
            )}

            <label>
              Ghi chú (giờ nhận, nội dung viết lên bánh...)
              <textarea rows="2" value={f.note} onChange={set('note')} />
            </label>

            <fieldset>
              <legend>Thanh toán</legend>
              <label className="radio">
                <input type="radio" name="pay" checked={f.pay === 'cod'} onChange={() => setF({ ...f, pay: 'cod' })} />
                <span>Tiền mặt khi nhận bánh</span>
              </label>
              <label className="radio">
                <input type="radio" name="pay" checked={f.pay === 'bank'} onChange={() => setF({ ...f, pay: 'bank' })} />
                <span>Chuyển khoản ngân hàng</span>
              </label>
            </fieldset>

            <div className="order-box">
              {t.lines.map(({ p, qty }) => (
                <div className="row" key={p.id}>
                  <span>{p.name} × {qty}</span>
                  <span>{fmt(p.price * qty)}</span>
                </div>
              ))}
              <div className="row"><span>Phí giao hàng</span><span>{t.fee ? fmt(t.fee) : 'Miễn phí'}</span></div>
              <div className="row total"><span>Tổng cộng</span><b>{fmt(t.total)}</b></div>
            </div>

            <button className="btn primary wide" type="submit" disabled={sending || t.lines.length === 0}>
              {sending ? 'Đang gửi đơn...' : `Xác nhận đặt hàng · ${fmt(t.total)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   6. APP
   ========================================================= */
function App() {
  const [cart, setCart] = useState(loadCart)
  const [drawer, setDrawer] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* bỏ qua nếu trình duyệt chặn lưu trữ */
    }
  }, [cart])

  useEffect(() => {
    document.body.style.overflow = drawer || checkout ? 'hidden' : ''
  }, [drawer, checkout])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setCheckout(false)
        setDrawer(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const count = Object.values(cart).reduce((s, n) => s + n, 0)

  function add(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
    const p = PRODUCTS.find((x) => x.id === id)
    setToast(`Đã thêm ${p.name} vào giỏ`)
    clearTimeout(add.t)
    add.t = setTimeout(() => setToast(''), 1800)
  }

  function setQty(id, q) {
    setCart((c) => {
      const n = { ...c }
      if (q <= 0) delete n[id]
      else n[id] = Math.min(q, 99)
      return n
    })
  }

  return (
    <>
      <Awning />
      <Header count={count} onCart={() => setDrawer(true)} />
      <main>
        <Hero onAdd={add} />
        <Menu cart={cart} onAdd={add} />
        <About />
        <Contact />
      </main>
      <Footer />

      {count > 0 && !drawer && (
        <button className="fab" onClick={() => setDrawer(true)}>
          🛒 Xem giỏ ({count})
        </button>
      )}
      <div className={'toast' + (toast ? ' show' : '')} role="status">{toast}</div>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        cart={cart}
        setQty={setQty}
        onCheckout={() => {
          setDrawer(false)
          setCheckout(true)
        }}
      />
      {checkout && (
        <Checkout
          cart={cart}
          onClose={() => setCheckout(false)}
          onDone={() => setCart({})}
        />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)

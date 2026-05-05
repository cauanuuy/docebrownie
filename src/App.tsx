/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBasket, 
  Plus, 
  Minus, 
  Trash2, 
  Info, 
  ChevronLeft, 
  Search, 
  Heart, 
  Bike, 
  Clock, 
  CheckCircle2, 
  Copy,
  Settings,
  X,
  PlusCircle,
  CalendarCheck,
  Star,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Product {
  id: string;
  name: string;
  desc?: string;
  img: string;
  price?: number;
  p300?: number;
  p500?: number;
  stock: boolean;
  category: 'especiais' | 'acai' | 'brownies';
  customAcai?: boolean;
  hasFlavors?: boolean;
  flavors?: Flavor[];
}

interface Flavor {
  id: string;
  name: string;
  desc?: string;
  img: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
  complements?: string[];
  flavor?: string;
  bananaBatido?: boolean;
}

const WHATSAPP_NUMBER = "5575981243234";
const PIX_KEY = "75981243234";
const ADMIN_PASS = "01012025";
const COMPLEMENT_PRICE = 0; // Complements for bottle acai are included/limited, not extra price mentioned besides the base product price

const ACAI_GARRAFA_IMG = "https://i.ibb.co/jvgsT9S8/IMG-2244.jpg";

export default function App() {
  // State
  const [menuData, setMenuData] = useState<{ [key: string]: Product[] }>({
    especiais: [
      { id: 'copo_uva_ninho_nutella', name: 'Copo da Felicidade Uva', desc: 'Ninho e Nutella', img: 'https://i.ibb.co/0prVxcNz/IMG-2473.png', price: 15.00, stock: true, category: 'especiais' },
      { id: 'copo_morango_ninho_nutella', name: 'Copo da Felicidade Morango', desc: 'Ninho e Nutella', img: 'https://i.ibb.co/4RG10pjQ/IMG-2485.png', price: 16.50, stock: true, category: 'especiais' },
      { id: 'acai_montado', name: 'Monte seu Açaí', desc: 'Escolha seus complementos', img: 'https://i.ibb.co/ccb1Q6cc/IMG-2508.png', price: 17.00, stock: true, category: 'especiais', customAcai: true }
    ],
    acai: [
      { 
        id: 'garrafa_acai', 
        name: 'Açaí na Garrafa', 
        desc: 'Cremoso e geladinho', 
        img: ACAI_GARRAFA_IMG, 
        p300: 13, 
        p500: 18, 
        stock: true, 
        category: 'acai',
        hasFlavors: true,
        flavors: [
          { id: 'f_tradicional', name: 'Original Premium', desc: 'Sabor puro da fruta', img: ACAI_GARRAFA_IMG },
          { id: 'f_morango', name: 'Morango com Ninho', desc: 'O clássico mais pedido', img: ACAI_GARRAFA_IMG },
          { id: 'f_nutella', name: 'Nutella com Morango', desc: 'Puro sabor premium', img: ACAI_GARRAFA_IMG },
          { id: 'f_maracuja', name: 'Maracujá', desc: 'Refrescante e tropical', img: ACAI_GARRAFA_IMG },
          { id: 'f_avela', name: 'Avelã', desc: 'Toque sofisticado', img: ACAI_GARRAFA_IMG }
        ]
      }
    ],
    potes: [
      { 
        id: 'bpote', 
        name: 'Brownie de Pote', 
        desc: 'Sabores cremosos no pote', 
        img: 'https://i.ibb.co/0dc9Tcg/IMG-1677.jpg', 
        price: 14, 
        stock: true, 
        category: 'potes',
        hasFlavors: true,
        flavors: [
          { id: 'b_mn', name: 'Morango/Ninho', desc: 'Morango fresco e ninho', img: 'https://i.ibb.co/0j6vjMqs/IMG-2163.jpg' },
          { id: 'b_cn', name: 'Casadinho Chocolate/Ninho', desc: 'Chocolate e Ninho', img: 'https://i.ibb.co/fGrsGpfc/IMG-1686.jpg' },
          { id: 'b_cm', name: 'Casadinho Chocolate/Maracujá', desc: 'Chocolate e Maracujá', img: 'https://i.ibb.co/twxgPsgT/IMG-1681.jpg' },
          { id: 'b_limao', name: 'Limão', desc: 'Mousse refrescante', img: 'https://i.ibb.co/G4fdhLdv/IMG-1679.jpg' },
          { id: 'b_choc', name: 'Chocolate', desc: 'Chocolate intenso', img: 'https://i.ibb.co/fGrsGpfc/IMG-1686.jpg' },
          { id: 'b_marac', name: 'Maracujá', desc: 'Creme de maracujá', img: 'https://i.ibb.co/twxgPsgT/IMG-1681.jpg' }
        ]
      }
    ],
    brownies: [
      { 
        id: 'brownie_recheado', 
        name: 'Brownie Recheado', 
        desc: 'Delicioso brownie com recheio cremoso', 
        img: 'https://i.ibb.co/fGrsGpfc/IMG-1686.jpg', 
        price: 7, 
        stock: true, 
        category: 'brownies',
        hasFlavors: true,
        flavors: [
          { id: 'br_mn', name: 'Morango/Ninho', desc: 'Combinado perfeito', img: 'https://i.ibb.co/0j6vjMqs/IMG-2163.jpg' },
          { id: 'br_cn', name: 'Casadinho Chocolate/Ninho', desc: 'Duo clássico', img: 'https://i.ibb.co/fGrsGpfc/IMG-1686.jpg' },
          { id: 'br_cm', name: 'Casadinho Chocolate/Maracujá', desc: 'Sabor tropical', img: 'https://i.ibb.co/twxgPsgT/IMG-1681.jpg' },
          { id: 'br_limao', name: 'Limão', desc: 'Acidez na medida', img: 'https://i.ibb.co/G4fdhLdv/IMG-1679.jpg' },
          { id: 'br_choc', name: 'Chocolate', desc: 'Puro chocolate', img: 'https://i.ibb.co/fGrsGpfc/IMG-1686.jpg' },
          { id: 'br_marac', name: 'Maracujá', desc: 'Creme artesanal', img: 'https://i.ibb.co/twxgPsgT/IMG-1681.jpg' }
        ]
      }
    ]
  });


  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('especiais');
  const [shopStatus, setShopStatus] = useState({ open: false, label: '', nextLabel: '' });
  const [adminMode, setAdminMode] = useState(false);
  const [platformModal, setPlatformModal] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [changeFor, setChangeFor] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Complex Modals State
  const [acaiMontadoModal, setAcaiMontadoModal] = useState(false);
  const [flavorSelectionModal, setFlavorSelectionModal] = useState<{ product: Product, size?: '300ml' | '500ml' } | null>(null);
  const [selectedComplements, setSelectedComplements] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
  const [bananaBatido, setBananaBatido] = useState(false);

  const complementsMaster = ["Chocolate", "Morango", "Paçoca", "Leite Condensado", "Cobertura de Chocolate", "Creme de Ninho", "Creme de Maracujá", "Creme de Avelã", "Leite em Pó", "Banana", "Xerém de Amendoim"];
  const complementsAcaiGarrafa = ["Creme de avela", "Creme de maracujá", "Creme de ninho", "Creme de morango", "Leite em pó", "Leite condensado"];

  // Logic: Check Shop Status
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Hours: Mon-Fri: 15:30 - 23:59 | Sat-Sun: 13:00 - 23:59
      let openTimeToday = (day === 0 || day === 6) ? 13 * 60 : 15 * 60 + 30;
      let labelToday = (day === 0 || day === 6) ? "13:00" : "15:30";
      const closeTime = 23 * 60 + 59;

      const tomorrowDay = (day + 1) % 7;
      let labelTomorrow = (tomorrowDay === 0 || tomorrowDay === 6) ? "13:00" : "15:30";

      if (currentTime >= openTimeToday && currentTime < closeTime) {
        setShopStatus({ open: true, label: "Aberto Agora", nextLabel: "" });
      } else if (currentTime < openTimeToday) {
        setShopStatus({ open: false, label: `Abre hoje às ${labelToday}`, nextLabel: labelToday });
      } else {
        setShopStatus({ open: false, label: `Abre amanhã às ${labelTomorrow}`, nextLabel: labelTomorrow });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cart Helpers
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => 
        i.id === item.id && 
        i.flavor === item.flavor && 
        i.bananaBatido === item.bananaBatido &&
        JSON.stringify(i.complements) === JSON.stringify(item.complements)
      );
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  // Handlers
  const handleFinalize = () => {
    if (!customerName || !address) {
      alert("Por favor, preencha seu nome e endereço!");
      return;
    }
    if (paymentMethod === 'Dinheiro' && !changeFor) {
      alert("Por favor, informe o valor para o troco.");
      return;
    }

    let msg = !shopStatus.open ? `*AGENDAMENTO PARA ${shopStatus.nextLabel}*\n` : `*NOVO PEDIDO - PÉ DE AÇAÍ* 🍇\n`;
    msg += `------------------------------\n👤 CLIENTE: ${customerName}\n------------------------------\n\n`;
    
    cart.forEach(item => {
      msg += `• ${item.name}`;
      if (item.flavor) msg += ` (Sabor: ${item.flavor})`;
      if (item.bananaBatido) msg += ` (Batido c/ Banana: Sim)`;
      if (item.complements && item.complements.length > 0) {
        msg += ` (Comp: ${item.complements.join(', ')})`;
      }
      msg += ` x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2).replace('.',',')}\n`;
    });

    msg += `\n*TOTAL DO PEDIDO: R$ ${cartTotal.toFixed(2).replace('.',',')}*`; 
    msg += `\n\n*PAGAMENTO:* ${paymentMethod}`;
    if (paymentMethod === 'Dinheiro') msg += `\n*TROCO PARA:* R$ ${parseFloat(changeFor).toFixed(2).replace('.',',')}`;
    if (paymentMethod === 'Pix') msg += `\n*CHAVE PIX:* ${PIX_KEY}`;
    msg += `\n*ENDEREÇO:* ${address}`;
    if (orderNotes) msg += `\n*OBSERVAÇÕES:* ${orderNotes}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    
    setOrderConfirmed(true);
    setCart([]);
    setIsCartOpen(false);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    alert("Chave Pix copiada!");
  };

  const openFlavorModal = (product: Product, size?: '300ml' | '500ml') => {
    setFlavorSelectionModal({ product, size });
    setSelectedFlavor(product.flavors ? product.flavors[0] : null);
    setSelectedComplements([]);
    setBananaBatido(false);
  };

  const confirmFlavorSelection = () => {
    if (!flavorSelectionModal || !selectedFlavor) return;
    
    const { product, size } = flavorSelectionModal;
    const price = size === '500ml' ? (product.p500 || 0) : (size === '300ml' ? (product.p300 || 0) : (product.price || 0));
    const name = size ? `${product.name} ${size}` : product.name;

    addToCart({
      id: `${product.id}_${selectedFlavor.id}_${size || 'default'}`,
      name: name,
      flavor: selectedFlavor.name,
      price: price,
      quantity: 1,
      img: selectedFlavor.img,
      bananaBatido: (product.category === 'acai' || product.category === 'acai_garrafinha') ? bananaBatido : undefined,
      complements: (product.category === 'acai' || product.category === 'acai_garrafinha') ? [...selectedComplements] : undefined
    });

    setFlavorSelectionModal(null);
    setSelectedFlavor(null);
    setSelectedComplements([]);
    setBananaBatido(false);
  };

  const confirmAcaiMontado = () => {
    const basePrice = 17.00;
    const finalPrice = basePrice + (selectedComplements.length * 1.00); // Using 1.00 for original acai montado logic
    
    addToCart({
      id: 'acai_montado_custom',
      name: 'Açaí Montado Customizado',
      price: finalPrice,
      quantity: 1,
      img: 'https://i.ibb.co/ccb1Q6cc/IMG-2508.png',
      complements: [...selectedComplements]
    });

    setAcaiMontadoModal(false);
    setSelectedComplements([]);
  };

  return (
    <div className="min-h-screen bg-purple-50 pb-24 font-['Poppins',_sans-serif]">
      {/* Lilac Background Blur Overlay - High Density Style */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-r from-purple-300 via-purple-400 to-fuchsia-300 opacity-60 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-purple-300/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-pink-100/30 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence>
        {platformModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 bg-purple-950 z-[500] text-white"
          >
            <div className="text-center">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-36 h-36 mx-auto rounded-full border-4 border-white shadow-2xl overflow-hidden mb-8 flex items-center justify-center bg-white"
              >
                <img src="https://i.ibb.co/35xV1PKj/BDAFD8-D9-9-AA0-4910-BED4-2505-B9-B9-AE4-D-removebg-preview.png" alt="Logo" className="w-24 h-24 object-contain" />
              </motion.div>
              <h2 className="text-4xl font-black italic mb-2 tracking-tight drop-shadow-lg">ONDE DESEJA PEDIR?</h2>
              <p className="text-purple-300 mb-10 font-bold uppercase tracking-widest text-xs opacity-70">Escolha sua plataforma preferida</p>
              
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                <button 
                  onClick={() => setPlatformModal(false)}
                  className="w-full bg-white text-purple-950 py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(255,255,255,0.1)] transform active:scale-95 transition-all uppercase tracking-wide"
                >
                  <ShoppingBasket size={24} /> PEÇA POR AQUI <span className="text-[10px] opacity-40 font-bold">(SITE)</span>
                </button>
                
                <a 
                  href="https://www.ifood.com.br/delivery/feira-de-santana-ba/doce-brownie-acai-campo-limpo/64ea4d4d-bb58-4cd3-a2ed-7c19c5d7b"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(220,38,38,0.2)] transform active:scale-95 transition-all uppercase tracking-wide"
                >
                  <Bike size={24} /> RECEBA PELO IFOOD
                </a>
              </div>

              <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mt-16 opacity-50">PÉ DE AÇAÍ © 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - High Density Blur */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-purple-950/80 backdrop-blur-2xl text-white p-5 shadow-[0_8px_32px_rgba(46,16,101,0.2)] flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full border-2 border-white shadow-lg overflow-hidden flex-shrink-0 p-1">
            <img src="https://i.ibb.co/35xV1PKj/BDAFD8-D9-9-AA0-4910-BED4-2505-B9-B9-AE4-D-removebg-preview.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-black text-base uppercase italic tracking-tight">Pé de Açaí</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${shopStatus.open ? 'bg-green-400' : 'bg-orange-400'}`}></span>
              <p className={`text-[9px] font-black uppercase tracking-[0.1em] ${shopStatus.open ? 'text-green-400' : 'text-orange-400'}`}>
                {shopStatus.label}
              </p>
            </div>
          </div>
        </div>
        <button onClick={() => {
          const pass = prompt("Senha Admin:");
          if (pass === ADMIN_PASS) setAdminMode(true);
        }} className="bg-white/10 p-2.5 rounded-2xl hover:bg-white/20 transition-all text-white shadow-inner">
          <Settings size={20} />
        </button>
      </header>

      {/* Hero Banner with High Density Gradients */}
      <div className="relative h-64 w-full flex-shrink-0 pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-purple-400 to-fuchsia-300"></div>
        <div className="absolute inset-0 backdrop-blur-xl bg-purple-500/20"></div>
        <div className="relative z-10 p-8 flex items-end h-full justify-between">
           {/* Space for card positioning */}
        </div>
      </div>

      {/* Shop Profile Card - High Density Layout */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-20 mx-auto w-11/12 bg-white/95 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(75,26,90,0.15)] p-8 z-10 border border-white"
      >
        <div className="absolute -top-14 left-8 w-28 h-28 bg-purple-100 rounded-full border-4 border-white shadow-2xl overflow-hidden p-2">
          <img src="https://i.ibb.co/35xV1PKj/BDAFD8-D9-9-AA0-4910-BED4-2505-B9-B9-AE4-D-removebg-preview.png" alt="Store Logo" className="w-full h-full object-contain" />
        </div>
        <div className="mt-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-black text-4xl text-purple-950 italic tracking-tight">PÉ DE AÇAÍ</h2>
            <div className="flex gap-4 mt-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Segunda a Sexta</span>
                <span className="text-sm font-black text-slate-800">15:30 — 23:59</span>
              </div>
              <div className="w-px h-8 bg-purple-100"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Sáb/Dom</span>
                <span className="text-sm font-black text-slate-800">13:00 — 23:59</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-3xl border border-purple-100">
            <span className="flex items-center gap-2 text-purple-700 font-black text-xs uppercase tracking-widest"><Bike size={18} /> 25-40 min</span>
          </div>
        </div>
      </motion.div>

      {/* Scheduling Alert - Themed */}
      {!shopStatus.open && (
        <motion.div 
          animate={{ scale: [1, 1.01, 1] }} 
          transition={{ repeat: Infinity, duration: 3 }}
          className="mx-auto w-11/12 bg-purple-950 text-white text-[10px] font-black p-4 text-center rounded-3xl shadow-2xl mt-6 flex items-center justify-center gap-3 uppercase tracking-[0.2em] border border-white/10"
        >
          <CalendarCheck size={18} className="text-yellow-400" /> AGENDAMENTO LIBERADO
        </motion.div>
      )}

      {/* Menu Navigation - Rounded 40 */}
      <div className="sticky top-[88px] z-30 bg-white/90 backdrop-blur-xl border-b border-purple-50 flex gap-4 p-4 overflow-x-auto no-scrollbar shadow-sm mt-8">
        {[
          { id: 'especiais', name: 'Especiais' },
          { id: 'acai', name: 'Açaí Garrafa' },
          { id: 'potes', name: 'Potes' },
          { id: 'brownies', name: 'Brownies' }
        ].map((cat) => {
          const catId = cat.id;
          return (
            <button
              key={catId}
              onClick={() => {
                setActiveCategory(catId);
                const element = document.getElementById(`section-${catId}`);
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop - 150,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`flex-shrink-0 px-8 py-3.5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === catId ? 'bg-purple-600 text-white shadow-xl shadow-purple-200' : 'bg-purple-50 text-purple-600 border border-purple-100'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>


      <main className="px-6 mt-8 space-y-12">
        {/* Especiais */}
        <section id="section-especiais" className="scroll-mt-[160px]">
          <div className="flex items-end justify-between mb-6 px-2">
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Signature</span>
              <h3 className="font-black text-2xl text-purple-950 italic">Nossos Especiais</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuData.especiais.map((item) => (
              <motion.div 
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.customAcai) setAcaiMontadoModal(true);
                  else addToCart({ id: item.id, name: item.name, price: item.price || 0, quantity: 1, img: item.img });
                }}
                className="bg-white p-6 rounded-[40px] shadow-[0_10px_30px_rgba(75,26,90,0.05)] border border-purple-50 flex items-center gap-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                   <div className="absolute inset-0 bg-purple-100 rounded-3xl group-hover:rotate-6 transition-transform"></div>
                   <img src={item.img} alt={item.name} className="relative w-full h-full object-cover rounded-3xl shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-base text-purple-950 leading-tight uppercase italic">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 italic mb-2 tracking-wide">{item.desc}</p>
                  <p className="text-purple-600 font-black text-xl">R$ {item.price?.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Plus size={24} strokeWidth={3} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Açaí Garrafinhas */}
        <section id="section-acai" className="scroll-mt-[160px]">
          <div className="flex items-end justify-between mb-6 px-2">
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Pure Açaí</span>
              <h3 className="font-black text-2xl text-purple-950 italic">Açaí Garrafinhas</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuData.acai.map((item) => (
              <motion.div 
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openFlavorModal(item)}
                className="bg-white p-6 rounded-[40px] shadow-[0_10px_30px_rgba(75,26,90,0.05)] border border-purple-50 flex items-center gap-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                   <div className="absolute inset-0 bg-purple-100 rounded-3xl group-hover:rotate-6 transition-transform"></div>
                   <img src={item.img} alt={item.name} className="relative w-full h-full object-cover rounded-3xl shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-base text-purple-950 leading-tight uppercase italic">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 italic mb-2 tracking-wide font-medium">Original e Refrescante</p>
                  <p className="text-purple-600 font-black text-xl italic">A partir de R$ 13,00</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Plus size={24} strokeWidth={3} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Brownies de Pote */}
        <section id="section-potes" className="scroll-mt-[160px]">
          <div className="flex items-end justify-between mb-6 px-2">
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Signature</span>
              <h3 className="font-black text-2xl text-purple-950 italic">Brownies de Pote</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuData.potes.map((item) => (
              <motion.div 
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openFlavorModal(item)}
                className="bg-white p-6 rounded-[40px] shadow-[0_10px_30px_rgba(75,26,90,0.05)] border border-purple-50 flex items-center gap-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                   <div className="absolute inset-0 bg-purple-100 rounded-3xl group-hover:rotate-3 transition-transform"></div>
                   <img src={item.img} alt={item.name} className="relative w-full h-full object-cover rounded-3xl shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-base text-purple-950 leading-tight uppercase italic">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 italic mb-2 tracking-wide font-medium">Vários sabores cremosos</p>
                  <p className="text-purple-600 font-black text-lg italic">R$ {item.price?.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                  <Plus size={20} strokeWidth={3} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Brownies */}
        <section id="section-brownies" className="scroll-mt-[160px]">
          <div className="flex items-end justify-between mb-6 px-2">
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Sweeter</span>
              <h3 className="font-black text-2xl text-purple-950 italic">Sweet Brownies</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuData.brownies.map((item) => (
              <motion.div 
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.hasFlavors) openFlavorModal(item);
                  else addToCart({ id: item.id, name: item.name, price: item.price || 0, quantity: 1, img: item.img });
                }}
                className="bg-white p-6 rounded-[40px] shadow-[0_10px_30px_rgba(75,26,90,0.05)] border border-purple-50 flex items-center gap-6 cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                   <div className="absolute inset-0 bg-purple-100 rounded-3xl group-hover:rotate-3 transition-transform"></div>
                   <img src={item.img} alt={item.name} className="relative w-full h-full object-cover rounded-3xl shadow-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-base text-purple-950 leading-tight uppercase italic">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 italic mb-2 tracking-wide">{item.desc}</p>
                  <p className="text-purple-600 font-black text-lg">R$ {item.price?.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                  <Plus size={20} strokeWidth={3} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Bottom Bar - High Density White/Lilac */}
      {cart.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-purple-100 p-6 flex justify-between items-center shadow-[0_-20px_60px_rgba(75,26,90,0.1)] rounded-t-[48px]"
        >
          <div className="flex gap-8">
            <div className="flex flex-col">
              <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em]">Sacola</p>
              <p className="font-black text-purple-950 text-xl italic">{cart.reduce((a, b) => a + b.quantity, 0)} Itens</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em]">Total</p>
              <p className="font-black text-purple-600 text-xl italic">R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-purple-950 text-white px-10 py-5 rounded-[24px] font-black text-sm flex items-center gap-3 shadow-2xl shadow-purple-900/20 active:scale-95 transition-all uppercase tracking-widest"
          >
            Ver Pedido <ChevronLeft size={18} className="rotate-270" />
          </button>
        </motion.div>
      )}

      {/* Modal: Dynamic Flavor Selection - Themed */}
      <AnimatePresence>
        {flavorSelectionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFlavorSelectionModal(null)}
              className="absolute inset-0 bg-purple-950/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto"
            >
              <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden bg-purple-50">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedFlavor?.id || 'main'}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    src={selectedFlavor?.img || flavorSelectionModal.product.img} 
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <h3 className="text-4xl font-black italic uppercase leading-none">{flavorSelectionModal.product.name}</h3>
                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest mt-2">
                    {flavorSelectionModal.size ? `Garrafa ${flavorSelectionModal.size}` : 'Monte agora'}
                  </p>
                </div>
                <button 
                  onClick={() => setFlavorSelectionModal(null)}
                  className="absolute top-6 right-6 bg-white/10 backdrop-blur-md text-white p-2.5 rounded-2xl hover:bg-white/20 transition-all shadow-inner"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-10 overflow-y-auto">
                {flavorSelectionModal.product.category === 'acai' && !flavorSelectionModal.size ? (
                  <div className="mb-10">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-6">Escolha o Tamanho</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[ 
                        { label: '300ml', price: flavorSelectionModal.product.p300 },
                        { label: '500ml', price: flavorSelectionModal.product.p500 }
                      ].map(sz => (
                        <button
                          key={sz.label}
                          onClick={() => setFlavorSelectionModal({ ...flavorSelectionModal, size: sz.label as any })}
                          className="flex flex-col items-center justify-center p-8 bg-purple-50 rounded-[32px] border-2 border-transparent hover:border-purple-600 transition-all group active:scale-95"
                        >
                          <p className="text-2xl font-black italic text-purple-950 mb-2 uppercase">{sz.label}</p>
                          <p className="text-lg font-black text-purple-600">R$ {sz.price?.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-8">
                      <div className="max-w-[70%]">
                        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Sabor Selecionado</h4>
                        <p className="text-2xl font-black text-purple-950 italic uppercase leading-tight">{selectedFlavor?.name || 'Selecione abaixo'}</p>
                        <p className="text-xs text-slate-400 font-medium mt-2">{selectedFlavor?.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Unid.</p>
                        <p className="text-3xl font-black text-purple-600 italic">
                          R$ {(flavorSelectionModal.size === '500ml' ? flavorSelectionModal.product.p500 : (flavorSelectionModal.size === '300ml' ? flavorSelectionModal.product.p300 : flavorSelectionModal.product.price))?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {flavorSelectionModal.product.category === 'acai' && (

                  <div className="mb-8 space-y-6">
                    <div className="p-5 bg-purple-50 rounded-[32px] border-2 border-purple-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Opção Banana</p>
                        <p className="text-sm font-black text-purple-950 italic uppercase">Batido com Banana?</p>
                      </div>
                      <button 
                        onClick={() => setBananaBatido(!bananaBatido)}
                        className={`w-14 h-8 rounded-full transition-all relative ${bananaBatido ? 'bg-purple-600' : 'bg-slate-200'}`}
                      >
                        <motion.div 
                          animate={{ x: bananaBatido ? 24 : 4 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4 px-2">Adicione 2 Complementos (Grátis)</p>
                      <div className="grid grid-cols-1 gap-3">
                        {complementsAcaiGarrafa.map(comp => (
                          <button
                            key={comp}
                            onClick={() => {
                              if (selectedComplements.includes(comp)) {
                                setSelectedComplements(p => p.filter(c => c !== comp));
                              } else if (selectedComplements.length < 2) {
                                setSelectedComplements(p => [...p, comp]);
                              }
                            }}
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                              selectedComplements.includes(comp) 
                                ? 'border-purple-600 bg-purple-50 text-purple-600' 
                                : 'border-purple-50 bg-white text-slate-500'
                            }`}
                          >
                            <span className="text-xs font-black uppercase italic tracking-tight">{comp}</span>
                            {selectedComplements.includes(comp) ? <CheckCircle2 size={16} /> : <PlusCircle size={16} className="opacity-30" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Escolha o Sabor</p>
                  <div className="grid grid-cols-1 gap-4">
                    {flavorSelectionModal.product.flavors?.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFlavor(f)}
                        className={`flex items-center gap-5 p-5 rounded-[24px] border-2 transition-all group ${
                          selectedFlavor?.id === f.id 
                            ? 'border-purple-600 bg-purple-600 text-white shadow-xl shadow-purple-200 scale-[1.02]' 
                            : 'border-purple-50 bg-white text-purple-950 hover:bg-purple-50'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform ${selectedFlavor?.id === f.id ? 'border-2 border-white' : ''}`}>
                          <img src={f.img} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <p className="font-black text-sm uppercase italic tracking-tight">{f.name}</p>
                          <p className={`text-[10px] leading-tight mt-1 opacity-60 ${selectedFlavor?.id === f.id ? 'text-white' : 'text-slate-400'}`}>{f.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                    <button 
                      onClick={confirmFlavorSelection}
                      disabled={!selectedFlavor}
                      className="w-full bg-purple-950 text-white py-6 rounded-[32px] font-black shadow-2xl active:scale-95 transition-all text-lg flex items-center justify-center gap-4 uppercase tracking-widest"
                    >
                      <Plus size={24} strokeWidth={3} /> ADICIONAR À SACOLA
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Açaí Montado Customizer - Themed */}
      <AnimatePresence>
        {acaiMontadoModal && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAcaiMontadoModal(false)} className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="relative bg-white w-full rounded-t-[56px] p-10 max-h-[85vh] overflow-y-auto shadow-2xl border-t border-white"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                   <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Personalize</span>
                   <h3 className="text-3xl font-black text-purple-950 italic uppercase leading-none">Monte seu Açaí</h3>
                </div>
                <button onClick={() => setAcaiMontadoModal(false)} className="bg-purple-50 p-3 rounded-2xl text-purple-400 hover:text-purple-600 transition-colors"><X size={24} /></button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 px-2">
                Complementos <span className="text-purple-600">+R$ 1,00 cada</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {complementsMaster.map(comp => (
                  <label key={comp} className="flex items-center gap-4 p-5 bg-purple-50/50 rounded-[28px] border-2 border-transparent cursor-pointer transition-all has-[:checked]:border-purple-600 has-[:checked]:bg-purple-100/30 group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selectedComplements.includes(comp)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedComplements(p => [...p, comp]);
                        else setSelectedComplements(p => p.filter(c => c !== comp));
                      }}
                    />
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedComplements.includes(comp) ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-200' : 'border-purple-100 bg-white'}`}>
                      {selectedComplements.includes(comp) && <CheckCircle2 size={18} className="text-white" />}
                    </div>
                    <span className={`text-base font-black italic uppercase tracking-tight ${selectedComplements.includes(comp) ? 'text-purple-950' : 'text-slate-400'} group-hover:text-purple-950 transition-colors`}>{comp}</span>
                  </label>
                ))}
              </div>

              <div className="border-t border-purple-50 pt-10">
                <div className="flex justify-between items-center mb-10 px-4">
                  <span className="font-black text-purple-400 uppercase tracking-widest text-xs">Total Com Complementos</span>
                  <span className="font-black text-purple-950 text-4xl italic">R$ {(17 + selectedComplements.length).toFixed(2)}</span>
                </div>
                <button 
                  onClick={confirmAcaiMontado}
                  className="w-full bg-purple-950 text-white py-6 rounded-[32px] font-black shadow-2xl active:scale-95 transition-all text-xl uppercase tracking-widest shadow-purple-900/20"
                >
                  ADICIONAR À SACOLA
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Cart - High Density */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-purple-950/40 backdrop-blur-md" />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="relative bg-white w-full rounded-t-[56px] p-8 pb-12 max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col md:max-w-xl md:mx-auto md:rounded-[56px] md:bottom-8"
            >
              <div className="flex justify-between items-center mb-10 border-b border-purple-50 pb-6 px-4">
                <button onClick={() => setIsCartOpen(false)} className="text-purple-400 hover:text-purple-600 transition-colors bg-purple-50 p-2.5 rounded-2xl"><ChevronLeft size={24} /></button>
                <h2 className="text-2xl font-black text-purple-950 italic uppercase tracking-tight">CARRINHO</h2>
                <button onClick={() => {
                   setCart([]);
                   setCustomerName("");
                   setAddress("");
                   setOrderNotes("");
                }} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Vaziar tudo</button>
              </div>

              <div className="space-y-6 mb-12 flex-1">
                {cart.map((item, idx) => (
                  <div key={`${item.id}_${idx}`} className="flex items-center gap-6 bg-purple-50/50 p-6 rounded-[32px] border border-purple-50 shadow-sm">
                    <div className="relative w-20 h-20 flex-shrink-0">
                       <div className="absolute inset-x-0 bottom-0 top-2 bg-white rounded-2xl"></div>
                       <img src={item.img} className="relative w-full h-full object-cover rounded-2xl shadow-md border-2 border-white" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-base text-purple-950 leading-tight uppercase italic">{item.name}</h4>
                      {item.flavor && <p className="text-[10px] text-purple-600 font-black uppercase mt-1 tracking-wider">Sabor: {item.flavor}</p>}
                      {item.bananaBatido && <p className="text-[10px] text-yellow-600 font-black uppercase tracking-wider">Batido com Banana</p>}
                      {item.complements && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 line-clamp-2">Complementos: {item.complements.join(', ')}</p>}
                      <p className="text-purple-950 font-black text-lg mt-2">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/80 p-2 rounded-2xl shadow-inner border border-purple-100">
                      <button onClick={() => updateQuantity(idx, -1)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-xl transition-colors"><Minus size={18} strokeWidth={3} /></button>
                      <span className="font-black text-sm text-purple-950 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="text-purple-600 p-1.5 hover:bg-purple-50 rounded-xl transition-colors"><Plus size={18} strokeWidth={3} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-purple-50 pt-10 px-4">
                <div className="flex justify-between items-center text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span className="text-sm">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-purple-950 text-2xl uppercase italic tracking-tight">Total</span>
                  <span className="font-black text-purple-600 text-3xl italic">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="space-y-5 mt-10">
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="NOME COMPLETO" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-5 rounded-[24px] bg-purple-50 border-2 border-transparent focus:border-purple-600 outline-none font-black text-sm uppercase tracking-widest placeholder:text-purple-200 text-purple-950 shadow-inner"
                    />
                    <input 
                      type="text" 
                      placeholder="ENDEREÇO E NÚMERO" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-5 rounded-[24px] bg-purple-50 border-2 border-transparent focus:border-purple-600 outline-none font-black text-sm uppercase tracking-widest placeholder:text-purple-200 text-purple-950 shadow-inner"
                    />
                    <textarea 
                      placeholder="ADICIONE ALGUMA OBSERVAÇÃO AO SEU PEDIDO..." 
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full p-5 rounded-[24px] bg-purple-50 border-2 border-transparent focus:border-purple-600 outline-none font-black text-sm uppercase tracking-widest placeholder:text-purple-200 text-purple-950 shadow-inner h-32 resize-none"
                    />
                  </div>
                  
                  <div className="bg-purple-950 rounded-[40px] p-8 shadow-2xl flex flex-col gap-6">
                    <div>
                        <label className="text-[10px] font-black text-purple-300 uppercase block mb-4 tracking-[0.3em] text-center opacity-70">Forma de Pagamento</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Pix', 'Cartão', 'Dinheiro'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setPaymentMethod(type)}
                                    className={`p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                        paymentMethod === type 
                                            ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' 
                                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {paymentMethod === 'Pix' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 border-t border-white/5 text-center">
                        <p className="text-[10px] font-black text-purple-400 uppercase mb-3 tracking-widest opacity-60">Pague agora via Pix</p>
                        <p className="text-xl font-black text-white mb-2 tracking-tight drop-shadow-md">{PIX_KEY}</p>
                        <p className="text-[9px] font-bold text-purple-400 mb-6 uppercase opacity-80 italic tracking-widest">GABRIELY DOS SANTOS OLIVEIRA</p>
                        <button 
                          onClick={copyPix}
                          className="w-full bg-white text-purple-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                        >
                          <Copy size={16} /> Copiar Chave
                        </button>
                      </motion.div>
                    )}

                    {paymentMethod === 'Dinheiro' && (
                      <motion.input 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        type="number" 
                        placeholder="TROCO PARA QUANTO?" 
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-white/10 border-none outline-none font-black text-[10px] uppercase tracking-widest text-white placeholder:text-purple-400"
                      />
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleFinalize}
                  className={`w-full py-6 rounded-[32px] font-black text-white shadow-2xl active:scale-95 transition-all text-xl mt-8 flex items-center justify-center gap-4 uppercase tracking-[0.2em] ${
                    shopStatus.open ? 'bg-green-500 shadow-green-500/30' : 'bg-orange-500 shadow-orange-500/30'
                  }`}
                >
                  {shopStatus.open ? <Bike size={24} strokeWidth={3} /> : <Clock size={24} strokeWidth={3} />}
                  {shopStatus.open ? 'FINALIZAR NO WHATSAPP' : `AGENDAR P/ ${shopStatus.nextLabel}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Order Confirmed - Themed */}
      <AnimatePresence>
        {orderConfirmed && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-purple-950" />
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative text-white max-w-sm"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/40">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black mb-4 italic uppercase tracking-tight">Pedido Enviado!</h2>
              <p className="text-purple-300 mb-12 font-bold uppercase tracking-widest text-xs opacity-70 leading-relaxed">Seu pedido foi encaminhado ao WhatsApp. <br/> Prepare o coração (e o paladar)!</p>
              <button 
                onClick={() => setOrderConfirmed(false)}
                className="bg-white text-purple-950 px-12 py-5 rounded-[24px] font-black shadow-2xl uppercase tracking-widest active:scale-95 transition-all"
              >
                Voltar ao Menu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel - Themed */}
      <AnimatePresence>
        {adminMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-purple-50 z-[1000] p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10 border-b border-purple-100 pb-6">
              <div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Management</span>
                <h2 className="text-3xl font-black text-purple-950 italic uppercase tracking-tight">Painel Admin</h2>
              </div>
              <button onClick={() => setAdminMode(false)} className="bg-red-500 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all"><X size={24} /></button>
            </div>
            
            <div className="space-y-12">
              {(Object.entries(menuData) as [string, Product[]][]).map(([catId, products]) => (
                <div key={catId} className="bg-white p-8 rounded-[40px] shadow-sm border border-purple-100">
                  <h3 className="text-lg font-black text-purple-950 uppercase italic mb-6 px-2 border-l-4 border-purple-600 pl-4">{catId}</h3>
                  <div className="space-y-4">
                    {products.map((p, idx) => (
                      <div key={p.id} className="bg-purple-50/50 p-6 rounded-3xl border border-purple-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                             <img src={p.img} className="w-full h-full object-cover" />
                           </div>
                           <span className="font-black text-sm text-purple-950 uppercase italic">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-3 text-[10px] font-black uppercase text-purple-400 cursor-pointer">
                            EM ESTOQUE
                            <input 
                              type="checkbox" 
                              checked={p.stock}
                              className="w-5 h-5 rounded-lg accent-purple-600"
                              onChange={(e) => {
                                const newData = { ...menuData };
                                newData[catId][idx].stock = e.target.checked;
                                setMenuData(newData);
                              }}
                            />
                          </label>
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-purple-100">
                            <span className="text-[10px] font-bold text-purple-300">R$</span>
                            <input 
                              type="number" 
                              className="w-16 bg-transparent outline-none font-black text-purple-950 text-sm"
                              value={p.price || p.p300 || 0}
                              onChange={(e) => {
                                  const newData = { ...menuData };
                                  if (p.p300) newData[catId][idx].p300 = parseFloat(e.target.value);
                                  else newData[catId][idx].price = parseFloat(e.target.value);
                                  setMenuData(newData);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import dataFromFile from './data/data.json';
import data2FromFile from './data/data2.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const oliveOilBrandData = {
  GaiaOliva: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=GaiaOliva',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=gaiaoliva+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=gaiaoliva+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=gaiaoliva+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=gaiaoliva+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=gaiaoliva+zeytinyagi',
      // WebSitesi: '  https://www.gaiaoliva.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=gaiaoliva+zeytinyagi',
    },
  },
  Komili: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Komili',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=komili+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=komili+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=komili+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=komili+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=komili+zeytinyagi',
      // WebSitesi: '  https://www.komili.com.tr/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=komili+zeytinyagi',
    },
  },
  Marmarabirlik: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Marmarabirlik',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=marmarabirlik+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=marmarabirlik+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=marmarabirlik+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=marmarabirlik+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=marmarabirlik+zeytinyagi',
      // WebSitesi: '  https://www.marmarabirlik.com.tr/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=marmarabirlik+zeytinyagi',
    },
  },
  Kozoliv: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Kozoliv',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=kozoliv+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=kozoliv+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=kozoliv+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=kozoliv+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=kozoliv+zeytinyagi',
      // WebSitesi: '  https://www.kozoliv.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=kozoliv+zeytinyagi',
    },
  },
  Asiltane: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Asiltane',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=asiltane+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=asiltane+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=asiltane+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=asiltane+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=asiltane+zeytinyagi',
      // WebSitesi: '  https://www.asiltane.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=asiltane+zeytinyagi',
    },
  },
  Grandpa: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Grandpa',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=grandpa+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=grandpa+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=grandpa+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=grandpa+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=grandpa+zeytinyagi',
      // WebSitesi: '  https://www.grandpa.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=grandpa+zeytinyagi',
    },
  },
  Monteida: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Monteida',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=monteida+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=monteida+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=monteida+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=monteida+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=monteida+zeytinyagi',
      // WebSitesi: '  https://www.monteida.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=monteida+zeytinyagi',
    },
  },
  Tariş: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Tari%C5%9F',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=tari%C5%9F+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=tari%C5%9F+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=tari%C5%9F+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=tari%C5%9F+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=tari%C5%9F+zeytinyagi',
      // WebSitesi: '  https://www.taris.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=tari%C5%9F+zeytinyagi',
    },
  },
  Kristal: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Kristal',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=kristal+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=kristal+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=kristal+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=kristal+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=kristal+zeytinyagi',
      // WebSitesi: '  https://www.kristal.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=kristal+zeytinyagi',
    },
  },
  Yudum: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Yudum',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=yudum+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=yudum+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=yudum+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=yudum+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=yudum+zeytinyagi',
      // WebSitesi: '  https://www.yudum.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=yudum+zeytinyagi',
    },
  },
  Kırlangıç: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=K%C4%B1rlang%C4%B1%C3%A7',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=k%C4%B1rlang%C4%B1%C3%A7+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=k%C4%B1rlang%C4%B1%C3%A7+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=k%C4%B1rlang%C4%B1%C3%A7+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=k%C4%B1rlang%C4%B1%C3%A7+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=k%C4%B1rlang%C4%B1%C3%A7+zeytinyagi',
      // WebSitesi: '  https://www.kirlangic.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=k%C4%B1rlang%C4%B1%C3%A7+zeytinyagi',
    },
  },
  Kavlak: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Kavlak',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=kavlak+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=kavlak+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=kavlak+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=kavlak+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=kavlak+zeytinyagi',
      // WebSitesi: '  https://www.kavlak.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=kavlak+zeytinyagi',
    },
  },
  Ayolis: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Ayolis',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=ayolis+zeytinyagi',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=ayolis+zeytinyagi',
      // Amazon: '  https://www.amazon.com.tr/s?k=ayolis+zeytinyagi',
      Migros: '  https://www.migros.com.tr/arama?q=ayolis+zeytinyagi',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=ayolis+zeytinyagi',
      // WebSitesi: '  https://www.ayolis.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=ayolis+zeytinyagi',
    },
  },
};

const oliveBrandData = {
  Marmarabirlik: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Marmarabirlik',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=Marmarabirlik+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=Marmarabirlik+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=Marmarabirlik+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=Marmarabirlik+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=Marmarabirlik+zeytin+xl',
      // WebSitesi: '  https://www.marmarabirlik.com.tr/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=Marmarabirlik+zeytin+xl',
    },
  },
  "Öncü": {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=%C3%96nc%C3%BC',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=%C3%96nc%C3%BC+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=%C3%96nc%C3%BC+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=%C3%96nc%C3%BC+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=%C3%96nc%C3%BC+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=%C3%96nc%C3%BC+zeytin+xl',
      // WebSitesi: '  https://www.oncuzeytin.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=%C3%96nc%C3%BC+zeytin+xl',
    },
  },
  Kavlak: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Kavlak',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=Kavlak+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=Kavlak+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=Kavlak+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=Kavlak+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=Kavlak+zeytin+xl',
      // WebSitesi: '  https://www.kavlak.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=Kavlak+zeytin+xl',
    },
  },
  "Özgün Zeytincilik": {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=%C3%96zg%C3%BCn+Zeytincilik',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=%C3%96zg%C3%BCn+Zeytincilik+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=%C3%96zg%C3%BCn+Zeytincilik+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=%C3%96zg%C3%BCn+Zeytincilik+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=%C3%96zg%C3%BCn+Zeytincilik+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=%C3%96zg%C3%BCn+Zeytincilik+zeytin+xl',
      // WebSitesi: '  https://www.ozgunege.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=%C3%96zg%C3%BCn+Zeytincilik+zeytin+xl',
    },
  },
  Tariş: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Tari%C5%9F',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=Tari%C5%9F+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=Tari%C5%9F+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=Tari%C5%9F+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=Tari%C5%9F+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=Tari%C5%9F+zeytin+xl',
      // WebSitesi: '  https://www.taris.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=Tari%C5%9F+zeytin+xl',
    },
  },
  Kozoliv: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Kozoliv',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=Kozoliv+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=Kozoliv+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=Kozoliv+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=Kozoliv+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=Kozoliv+zeytin+xl',
      // WebSitesi: '  https://www.kozoliv.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=Kozoliv+zeytin+xl',
    },
  },
  Komili: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Komili',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=Komili+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=Komili+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=Komili+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=Komili+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=Komili+zeytin+xl',
      // WebSitesi: '  https://www.komili.com.tr/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=Komili+zeytin+xl',
    },
  },
  Ayolis: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Ayolis',
    links: {
      // Trendyol: '  https://www.trendyol.com/sr?q=Ayolis+zeytin+xl',
      // Hepsiburada: '  https://www.hepsiburada.com/ara?q=Ayolis+zeytin+xl',
      // Amazon: '  https://www.amazon.com.tr/s?k=Ayolis+zeytin+xl',
      Migros: '  https://www.migros.com.tr/arama?q=Ayolis+zeytin+xl',
      // Carrefoursa: '  https://www.carrefoursa.com/search?q=Ayolis+zeytin+xl',
      // WebSitesi: '  https://www.ayolis.com/  ',
      Macrocenter: '  https://www.macrocenter.com.tr/arama?q=Ayolis+zeytin+xl',
    },
  },
};
export default function App() {
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedChartBrands, setSelectedChartBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('GaiaOliva');
  const [priceInputs, setPriceInputs] = useState({
    tanim: '',
    online: '',
    supermarket: '',
    webSitesi: '',
  });
  const [selectedDateTab, setSelectedDateTab] = useState('');
  const [reportList, setReportList] = useState([]);
  const [notification, setNotification] = useState('');
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [productType, setProductType] = useState('Zeytinyağı');
  const currentBrandData = productType === 'Zeytinyağı' ? oliveOilBrandData : oliveBrandData;
  // currentBrand'ı seçili markaya göre al, eğer marka bulunamazsa ilk markayı kullan
  const currentBrandKey = currentBrandData[selectedBrand] ? selectedBrand : Object.keys(currentBrandData)[0];
  const currentBrand = currentBrandData[currentBrandKey];

  useEffect(() => {
    setReportList(dataFromFile);

    if (dataFromFile.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const dates = [...new Set(dataFromFile.map(item => item.tarih))];
      if (dates.includes(today)) {
        setSelectedDateTab(today);
      } else {
        setSelectedDateTab(dates.sort((a, b) => new Date(b) - new Date(a))[0]);
      }
    }
  }, []);

  useEffect(() => {
    updateTopGainersLosers();
  }, [reportList]);

  useEffect(() => {
    if (productType === 'Zeytinyağı') {
      const firstOliveOilBrand = Object.keys(oliveOilBrandData)[0];
      if (!oliveOilBrandData[selectedBrand]) {
        setSelectedBrand(firstOliveOilBrand);
      }
    } else if (productType === 'Zeytin') {
      setSelectedBrand('');
      const firstOliveBrand = Object.keys(oliveBrandData)[0];
      setTimeout(() => setSelectedBrand(firstOliveBrand), 0); // Bir sonraki render'da ayarla
    }
  }, [productType]);

    const getBackgroundClass = () => {
      return productType === 'Zeytinyağı' ? 'bg-yellow-200' : 'bg-green-200'; // Zeytinyağı: Açık sarı, Zeytin: Açık yeşil
    };
    
  const handleSaveReportExcel = () => {
    if (reportList.length === 0) {
      showNotification('Kaydedilecek veri bulunmuyor. Lütfen önce listeye ekleme yapın.', 'error');
      return;
    }
    const worksheetData = reportList.map(item => ({
      Marka: item.brand,
      Tanım: item.tanim,
      "Online Fiyat": item.online || '',
      "Süpermarket Fiyatı": item.supermarket || '',
      "Web Sitesi Fiyatı": item.webSitesi || '',
      Tarih: item.tarih
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Fiyat Raporu");
    XLSX.writeFile(wb, 'fiyat_raporu.xlsx');
    showNotification('Rapor başarıyla "fiyat_raporu.xlsx" olarak indirildi!', 'success');
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPriceInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (showChart && selectedChartBrands.length > 0) {
      updateChartData();
    }
  }, [selectedChartBrands, showChart]);

  const updateChartData = () => {
    if (reportList.length === 0) return;

    const brandsToShow = selectedChartBrands.length > 0
      ? selectedChartBrands
      : Object.keys(currentBrandData);

    const brandsData = {};
    reportList.forEach(item => {
      if (brandsToShow.includes(item.brand)) {
        if (!brandsData[item.brand]) {
          brandsData[item.brand] = [];
        }
        brandsData[item.brand].push({
          tarih: item.tarih,
          online: parseFloat(item.online) || null,
          supermarket: parseFloat(item.supermarket) || null,
          webSitesi: parseFloat(item.webSitesi) || null,
          tanim: item.tanim
        });
      }
    });

    const allDates = [...new Set(reportList
      .filter(item => brandsToShow.includes(item.brand))
      .map(item => item.tarih))].sort();

    if (allDates.length === 0) {
      setChartData(null);
      return;
    }

    const datasets = [];
    const brandColors = {
      GaiaOliva: 'rgb(75, 192, 192)',
      Komili: 'rgb(255, 99, 132)',
      Marmarabirlik: 'rgb(255, 159, 64)'
    };

    const priceTypeStyles = {
      online: { borderDash: [], lineWidth: 2 },
      supermarket: { borderDash: [5, 5], lineWidth: 2 },
      webSitesi: { borderDash: [10, 5], lineWidth: 2 }
    };

    const priceTypeLabels = {
      online: 'Online',
      supermarket: 'Süpermarket',
      webSitesi: 'Web Sitesi'
    };

    Object.keys(brandsData).forEach(brand => {
      const brandItems = brandsData[brand];
      const baseColor = brandColors[brand] || `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

      ['online', 'supermarket', 'webSitesi'].forEach(priceType => {
        const data = allDates.map(date => {
          const item = brandItems.find(i => i.tarih === date && i[priceType] !== null);
          return item ? item[priceType] : null;
        });

        if (data.some(value => value !== null)) {
          datasets.push({
            label: `${brand} - ${priceTypeLabels[priceType]}`,
            data,
            borderColor: baseColor,
            backgroundColor: baseColor + '20',
            ...priceTypeStyles[priceType],
            tension: 0.1,
            pointBackgroundColor: baseColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
          });
        }
      });
    });

    setChartData({
      labels: allDates,
      datasets: datasets
    });
  };

  const getUniqueDates = () => {
    const dates = [...new Set(reportList.map(item => item.tarih))];
    return dates.sort((a, b) => new Date(b) - new Date(a));
  };

  const getItemsForDate = (date) => {
    return reportList.filter(item => item.tarih === date);
  };

  const getUniqueBrandsFromData = () => {
    if (reportList.length === 0) return Object.keys(currentBrandData);
    const uniqueBrands = [...new Set(reportList.map(item => item.brand))];
    return uniqueBrands.sort();
  };

  const generateChartData = () => {
    if (reportList.length === 0) {
      showNotification('Grafik oluşturmak için yeterli veri bulunmuyor.', 'error');
      return;
    }
    setShowChart(true);
  };

  const calculatePriceChanges = () => {
    if (reportList.length === 0) return [];

    const sortedUniqueDates = [...new Set(reportList.map(item => item.tarih))].sort((a, b) => new Date(b) - new Date(a));
    console.log("Tüm benzersiz tarihler (azalan sırada):", sortedUniqueDates);

    if (sortedUniqueDates.length < 2) {
      console.log("Yeterli tarih verisi yok (en az 2 farklı tarih gerekli).");
      return [];
    }

    const latestDate = sortedUniqueDates[0];
    const referenceDate = sortedUniqueDates[1];

    const latestDateObj = new Date(latestDate);
    const targetDateObj = new Date(latestDateObj);
    targetDateObj.setDate(latestDateObj.getDate() - 7);
    const targetDateString = targetDateObj.toISOString().split('T')[0];

    console.log(`En güncel tarih: ${latestDate}`);
    console.log(`Hedef tarih (1 hafta önce): ${targetDateString}`);

    let previousDate = null;
    for (let i = 1; i < sortedUniqueDates.length; i++) {
      const currentDate = sortedUniqueDates[i];
      if (new Date(currentDate) <= targetDateObj) {
        previousDate = currentDate;
        console.log(`Bulunan uygun tarih: ${previousDate}`);
        break;
      }
    }

    if (!previousDate) {
      console.log(`"${targetDateString}" tarihine veya daha önceki bir tarihe ait veri bulunamadı.`);
      return [];
    }

    console.log(`Fiyat değişiklikleri hesaplanıyor: ${previousDate} -> ${latestDate}`);

    const productMap = new Map();
    reportList.forEach(item => {
      const key = `${item.brand}-${item.tanim}-${item.tarih}`;
      if (item.tarih === latestDate || item.tarih === previousDate) {
        if (!productMap.has(key)) {
          console.log("sss key:", key, "Tarih:", item.tarih);
          productMap.set(key, { brand: item.brand, tanim: item.tanim, [item.tarih]: item });
        } else {
          console.log("get key:", key, "Tarih:", item.tarih);
          productMap.get(key)[item.tarih] = item;
        }
      }
    });

    console.log("Oluşturulan productMap:", productMap);
    const priceChanges = [];

    for (const [key, productData] of productMap.entries()) {
      const latestDateKeys = [...productMap.keys()].filter(k => k.endsWith(latestDate));

      latestDateKeys.forEach(latestKey => {
        const [latestBrand, latestTanim] = latestKey.split('-').slice(0, -1).join('-').split('-', 2);
        const targetPreviousKey = `${latestBrand}-${latestTanim}-${previousDate}`;

        const latestItem = productMap.get(latestKey)[latestDate];
        const previousItem = productMap.get(targetPreviousKey)?.[previousDate];

        console.log(`İşlenen latestKey: ${latestKey}, targetPreviousKey: ${targetPreviousKey}`);
        console.log(`  latestItem var mı? ${!!latestItem}, previousItem var mı? ${!!previousItem}`);

        if (latestItem && previousItem) {
          console.log(`    ${latestKey} ve ${targetPreviousKey} için karşılaştırma yapılacak.`);
          ['online', 'supermarket', 'webSitesi'].forEach(priceType => {
            const latestPrice = parseFloat(latestItem[priceType]);
            const previousPrice = parseFloat(previousItem[priceType]);

            if (!isNaN(latestPrice) && !isNaN(previousPrice) && previousPrice !== 0) {
              const change = latestPrice - previousPrice;
              const changePercentage = ((change / previousPrice) * 100).toFixed(2);

              priceChanges.push({
                brand: latestItem.brand,
                tanim: latestItem.tanim,
                priceType: priceType,
                latestDate: latestDate,
                previousDate: previousDate,
                latestPrice: latestPrice,
                previousPrice: previousPrice,
                change: change,
                changePercentage: parseFloat(changePercentage)
              });
            }
          });
        } else {
          console.log(`    ${latestKey} için karşılaştırma YAPILAMADI (eksik tarih verisi).`);
        }
      });
    }

    console.log("Hesaplanan fiyat değişiklikleri:", priceChanges);
    return priceChanges;
  };

  const updateTopGainersLosers = () => {
    const changes = calculatePriceChanges();
    if (changes.length === 0) {
      setTopGainers([]);
      setTopLosers([]);
      return;
    }

    const uniqueProductsMap = new Map();
    changes.forEach(item => {
      const productKey = `${item.brand}-${item.tanim}`;
      const existingEntry = uniqueProductsMap.get(productKey);

      if (item.change > 0) {
        if (!existingEntry || (existingEntry.change > 0 && item.changePercentage > existingEntry.changePercentage)) {
          uniqueProductsMap.set(productKey, { ...item, type: 'gainer' });
        }
      } else if (item.change < 0) {
        if (!existingEntry || (existingEntry.change < 0 && item.changePercentage < existingEntry.changePercentage)) {
          uniqueProductsMap.set(productKey, { ...item, type: 'loser' });
        }
      }
    });

    const uniqueChanges = Array.from(uniqueProductsMap.values());

    const gainers = uniqueChanges
      .filter(item => item.type === 'gainer')
      .sort((a, b) => b.changePercentage - a.changePercentage)
      .slice(0, 5);

    const losers = uniqueChanges
      .filter(item => item.type === 'loser')
      .sort((a, b) => a.changePercentage - b.changePercentage)
      .slice(0, 5);

    setTopGainers(gainers);
    setTopLosers(losers);
  };

  const handleSaveToList = async (e) => {
    e.preventDefault();
    if (!priceInputs.online && !priceInputs.supermarket && !priceInputs.webSitesi) {
      showNotification('Lütfen en az bir fiyat alanı doldurun.', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: Date.now(),
      brand: selectedBrand,
      ...priceInputs,
      tarih: today
    };

    const updatedList = [...reportList, newEntry];
    setReportList(updatedList);
    setSelectedDateTab(today);
    setPriceInputs({ tanim: '', online: '', supermarket: '', webSitesi: '' });
    showNotification(`${selectedBrand} için fiyatlar listeye eklendi. Tarih: ${today}`, 'success');

    try {
      await saveDataToFile(updatedList);
    } catch (error) {
      console.error('Veri kaydedilirken hata oluştu:', error);
      showNotification('Veri kaydedilemedi. Lütfen tekrar deneyin.', 'error');
    }
  };

  const handleDeleteItem = (idToDelete) => {
    const today = new Date().toISOString().split('T')[0];
    const itemToDelete = reportList.find(item => item.id === idToDelete);

    if (itemToDelete && itemToDelete.tarih === today) {
      setReportList((prevList) => prevList.filter((item) => item.id !== idToDelete));
      showNotification('Öğe listeden başarıyla silindi.', 'success');
    } else {
      showNotification('Sadece bugün tarihli veriler silinebilir.', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleSaveReport = () => {
    if (reportList.length === 0) {
      showNotification('Kaydedilecek veri bulunmuyor. Lütfen önce listeye ekleme yapın.', 'error');
      return;
    }
    const dataStr = JSON.stringify(reportList, null, 2);
    const dataUri = 'application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'fiyat_raporu.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showNotification('Rapor başarıyla "fiyat_raporu.json" olarak indirildi!', 'success');
  };

  const saveDataToFile = async (data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    console.log("Veri kaydedildi:", data);
  };

  return (
     <div className={`text-gray-900 min-h-screen font-sans ${getBackgroundClass()}`}>
      {/* --- Header --- */}
      <header className="bg-[#131921] p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Fiyat Raporu</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {/* --- Yeni Toggle Butonları --- */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 text-center">Ürün Türü</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setProductType('Zeytinyağı')}
              className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all border ${
                productType === 'Zeytinyağı'
                  ? 'bg-yellow-500 text-white border-yellow-600 shadow-md' // Zeytinyağı seçiliyse buton rengi
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300' // Değilse gri
              }`}
            >
              Zeytinyağı
            </button>
            <button
              onClick={() => setProductType('Zeytin')}
              className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all border ${
                productType === 'Zeytin'
                  ? 'bg-green-500 text-white border-green-600 shadow-md' // Zeytin seçiliyse buton rengi
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300' // Değilse gri
              }`}
            >
              Zeytin
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Seçili Ürün: <span className="font-semibold">{productType}</span>
          </p>
        </div>
         {/* --- Marka Seçim Alanı ve Hızlı Erişim Linkleri --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Marka Seçimi</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <select
                value={currentBrandKey} // currentBrandKey'i value olarak kullan
                onChange={handleBrandChange}
                className="bg-gray-50 w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              >
                {Object.keys(currentBrandData).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-auto">
              <h2 className="text-xl font-semibold mb-2 lg:mb-4 text-gray-800 lg:hidden">Hızlı Erişim Linkleri</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(currentBrand.links).map(([name, link]) => (
                  <a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 text-center hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all border border-gray-300 shadow-sm"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
<div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Fiyat Bilgisi Ekle</h2>
          <form onSubmit={handleSaveToList} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium mb-1 text-gray-600">Marka</label>
              <input
                type="text"
                value={selectedBrand}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-2 py-1.5 cursor-not-allowed text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium mb-1 text-gray-600">Tanım</label>
              <input
                type="text"
                name="tanim"
                value={priceInputs.tanim}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium mb-1 text-gray-600">Online Fiyat</label>
              <input
                type="number"
                name="online"
                value={priceInputs.online}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium mb-1 text-gray-600">Süpermarket Fiyatı</label>
              <input
                type="number"
                name="supermarket"
                value={priceInputs.supermarket}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium mb-1 text-gray-600">Web Sitesi Fiyatı</label>
              <input
                type="number"
                name="webSitesi"
                value={priceInputs.webSitesi}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full md:col-span-1 bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-1.5 px-3 rounded-lg transition-colors h-[38px] border border-yellow-600 shadow-sm text-sm"
            >
              Listeye Kaydet
            </button>
          </form>
        </div>

      

        {/* --- Kaydedilenler Listesi with Tabs --- */}
        {reportList.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Kaydedilen Fiyatlar</h2>
            
            {/* Date Tabs */}
            <div className="flex overflow-x-auto mb-4 pb-1">
  {getUniqueDates().map((date) => (
    <button
      key={date}
      onClick={() => setSelectedDateTab(date)}
      className={`px-4 py-2 mr-2 rounded-lg whitespace-nowrap transition-colors ${
        selectedDateTab === date
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {new Date(date).toLocaleDateString('tr-TR')}
    </button>
  ))}
</div>

            {/* Tab Content */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {getItemsForDate(selectedDateTab).map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-3 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200"
                >
                  <div className="flex-grow">
                    <span className="font-bold text-gray-800 mr-2">{item.brand}</span>
                    {item.tanim && (
                      <span className="text-sm text-gray-600 font-medium bg-gray-200 px-2 py-1 rounded">
                        {item.tanim}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm flex-wrap">
                    {item.online && (
                      <span>
                        Online: <strong className="text-green-700">{item.online} TL</strong>
                      </span>
                    )}
                    {item.supermarket && (
                      <span>
                        Süpermarket: <strong className="text-green-700">{item.supermarket} TL</strong>
                      </span>
                    )}
                    {item.webSitesi && (
                      <span>
                        Web Sitesi: <strong className="text-green-700">{item.webSitesi} TL</strong>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={item.tarih !== new Date().toISOString().split('T')[0]}
                    className={`font-bold py-2 px-4 rounded-lg transition-colors self-start md:self-center border ${
                      item.tarih === new Date().toISOString().split('T')[0]
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300'
                        : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
            {/* --- Yeni Excel Butonu (Tablo Altında Sağda) --- */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveReportExcel}
                className="bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors border border-green-700 shadow-md"
              >
                Tabloyu Excel'e Aktar
              </button>
            </div>
          </div>
        )}


        {/* --- Raporu Kaydet Butonu --- */}
        {/* --- Raporu Kaydet ve Grafik Butonları --- */}
<div className="text-center mt-10 space-y-4 md:space-y-0 md:space-x-4">
  <button
    onClick={handleSaveReport}
    className="bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-extrabold py-3 px-8 rounded-lg transition-all text-lg shadow-lg transform hover:scale-105 border border-yellow-600"
  >
    Raporu Kaydet
  </button>
  
  <button
    onClick={generateChartData}
    className="bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold py-3 px-8 rounded-lg transition-all text-lg shadow-lg transform hover:scale-105 border border-blue-600"
  >
    Fiyat Değişim Grafiği
  </button>
</div>
      </main>

      {/* --- Bildirim Alanı --- */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.message}
        </div>
      )}

{/* --- Grafik Modal --- */}
      {showChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-0">
          <div className="bg-white w-full h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Fiyat Değişim Grafiği</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Marka fiyat analizleri</p>
                </div>
                <button
                  onClick={() => {
                    setShowChart(false);
                    setSelectedChartBrands([]);
                  }}
                  className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                  aria-label="Kapat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Brand Selection Panel - Değişiklik: w-32 md:w-40 lg:w-48 */}
              <div className="w-32 md:w-40 lg:w-48 border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0">
                <div className="p-2 sm:p-3 border-b border-gray-200">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Markalar</h3>
                  <div className="text-xs text-gray-500 mt-0.5 bg-white px-1.5 py-0.5 rounded-full inline-block text-center">
                    {selectedChartBrands.length === 0
                      ? "0"
                      : `${selectedChartBrands.length}`}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 sm:p-3">
                  <div className="space-y-1">
                    {getUniqueBrandsFromData().map(brand => (
                      <label
                        key={brand}
                        className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer px-1 py-1 sm:px-2 sm:py-1.5 rounded text-xs ${
                          selectedChartBrands.includes(brand)
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedChartBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChartBrands(prev => [...prev, brand]);
                            } else {
                              setSelectedChartBrands(prev => prev.filter(b => b !== brand));
                            }
                          }}
                          className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500 focus:ring-1"
                        />
                        <span className={`font-medium truncate ${
                          selectedChartBrands.includes(brand) ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-2 sm:p-3 border-t border-gray-200 space-y-1">
                  <button
                    onClick={() => setSelectedChartBrands(getUniqueBrandsFromData())}
                    className="w-full text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                  >
                    T
                  </button>
                  <button
                    onClick={() => setSelectedChartBrands([])}
                    className="w-full text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors"
                  >
                    -
                  </button>
                </div>
              </div>

              {/* Chart Area - Değişiklik: flex-1 */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-1 sm:p-2 flex-1">
                  <div className="bg-white rounded-lg border border-gray-200 p-1 sm:p-2 h-full flex flex-col">
                    {chartData && chartData.datasets.length > 0 ? (
                      <div className="flex-1 relative">
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top',
                                labels: {
                                  generateLabels: function (chart) {
                                    const datasets = chart.data.datasets;
                                    const uniqueBrands = [...new Set(datasets.map(ds => ds.label.split(' - ')[0]))];

                                    return uniqueBrands.map(brand => {
                                      const firstDataset = datasets.find(ds => ds.label.startsWith(brand));
                                      return {
                                        text: brand,
                                        fillStyle: firstDataset.borderColor,
                                        strokeStyle: firstDataset.borderColor,
                                        lineWidth: 2,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: datasets.findIndex(ds => ds.label.startsWith(brand))
                                      };
                                    });
                                  },
                                  usePointStyle: true,
                                  padding: 8,
                                  boxWidth: 6,
                                  font: {
                                    size: 8
                                  }
                                }
                              },
                              title: {
                                display: true,
                                text: 'Fiyat Değişim Analizi',
                                font: {
                                  size: 10,
                                  weight: 'bold'
                                },
                                padding: {
                                  top: 8,
                                  bottom: 12
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                borderColor: '#4f46e5',
                                borderWidth: 1,
                                padding: 6,
                                cornerRadius: 4,
                                displayColors: true,
                                mode: 'index',
                                intersect: false,
                                callbacks: {
                                  title: function (tooltipItems) {
                                    return tooltipItems[0].label;
                                  },
                                  label: function (context) {
                                    const currentValue = context.parsed.y;
                                    const dataset = context.dataset;
                                    const dataIndex = context.dataIndex;

                                    let previousValue = null;
                                    if (dataIndex > 0) {
                                      for (let i = dataIndex - 1; i >= 0; i--) {
                                        if (dataset.data[i] !== null) {
                                          previousValue = dataset.data[i];
                                          break;
                                        }
                                      }
                                    }

                                    let differenceText = '';
                                    let percentageText = '';

                                    if (previousValue !== null && currentValue !== null) {
                                      const difference = currentValue - previousValue;
                                      const differenceFormatted = difference.toFixed(2);
                                      const percentage = ((difference / previousValue) * 100).toFixed(1);

                                      if (difference > 0) {
                                        differenceText = ` (+${differenceFormatted} TL)`;
                                        percentageText = ` +%${percentage}`;
                                      } else if (difference < 0) {
                                        differenceText = ` (${differenceFormatted} TL)`;
                                        percentageText = ` -%${Math.abs(percentage)}`;
                                      } else {
                                        differenceText = ` (0.00 TL)`;
                                        percentageText = ` %0.0`;
                                      }
                                    }

                                    return `${context.dataset.label}: ${currentValue?.toFixed(2) || 0} TL${differenceText}${percentageText}`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: false,
                                title: {
                                  display: true,
                                  text: 'Fiyat (TL)',
                                  font: {
                                    size: 8
                                  }
                                },
                                ticks: {
                                  font: {
                                    size: 7
                                  }
                                }
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: 'Tarih',
                                  font: {
                                    size: 8
                                  }
                                },
                                ticks: {
                                  font: {
                                    size: 7
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <h3 className="text-sm font-medium text-gray-700 mb-0.5">Veri Yok</h3>
                          <p className="text-xs text-gray-500 max-w-xs">
                            Seçili markalara ait fiyat verisi mevcut değil.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-2 sm:p-3 border-t border-gray-200 flex justify-end flex-shrink-0">
              <button
                onClick={() => {
                  setShowChart(false);
                  setSelectedChartBrands([]);
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded text-sm transition-all duration-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
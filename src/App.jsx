// src/App.jsx
import React, { useState, useEffect } from 'react';
import dataFromFile from './data/data.json';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Marka bilgileri, logoları ve linkleri için bir veri yapısı
const brandData = {
  GaiaOliva: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=GaiaOliva',
    links: {
      Trendyol: 'https://www.trendyol.com/sr?q=gaiaoliva',
      Hepsiburada: 'https://www.hepsiburada.com/ara?q=gaiaoliva',
      Amazon: 'https://www.amazon.com.tr/s?k=gaiaoliva',
      Migros: 'https://www.migros.com.tr/arama?q=gaiaoliva',
      Carrefoursa: 'https://www.carrefoursa.com/search?q=gaiaoliva',
      WebSitesi: 'https://www.gaiaoliva.com/',
    },
  },
  Komili: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Komili',
    links: {
      Trendyol: 'https://www.trendyol.com/sr?q=komili',
      Hepsiburada: 'https://www.hepsiburada.com/ara?q=komili',
      Amazon: 'https://www.amazon.com.tr/s?k=komili',
      Migros: 'https://www.migros.com.tr/arama?q=komili',
      Carrefoursa: 'https://www.carrefoursa.com/search?q=komili',
      WebSitesi: 'https://www.komili.com.tr/',
    },
  },
  Marmarabirlik: {
    logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Marmarabirlik',
    links: {
      Trendyol: 'https://www.trendyol.com/sr?q=marmarabirlik',
      Hepsiburada: 'https://www.hepsiburada.com/ara?q=marmarabirlik',
      Amazon: 'https://www.amazon.com.tr/s?k=marmarabirlik',
      Migros: 'https://www.migros.com.tr/arama?q=marmarabirlik',
      Carrefoursa: 'https://www.carrefoursa.com/search?q=marmarabirlik',
      WebSitesi: 'https://www.marmarabirlik.com.tr/',
    },
  },
};

// Ana uygulama bileşeni
export default function App() {
  // State Yönetimi
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedChartBrands, setSelectedChartBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('GaiaOliva');
  const [priceInputs, setPriceInputs] = useState({
    tanim: '', // Yeni "Tanım" alanı eklendi
    online: '',
    supermarket: '',
    webSitesi: '',
  });
  const [selectedDateTab, setSelectedDateTab] = useState(''); // Add this new state
  const [reportList, setReportList] = useState([]);
  const [notification, setNotification] = useState('');

  const currentBrand = brandData[selectedBrand];
useEffect(() => {
  // Dosyadan gelen veriyi state'e set et
  setReportList(dataFromFile);
  
  // Set default selected tab to today's date if available, otherwise to first date
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

  // Dropdown değiştiğinde markayı günceller
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  // Input alanları değiştikçe state'i günceller
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPriceInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

 // Seçili markalar değiştiğinde grafiği otomatik güncelle
useEffect(() => {
  if (showChart && selectedChartBrands.length > 0) {
    updateChartData();
  }
}, [selectedChartBrands, showChart]);

// Grafik verilerini güncelleyen fonksiyon
const updateChartData = () => {
  if (reportList.length === 0) return;

  const brandsToShow = selectedChartBrands.length > 0 
    ? selectedChartBrands 
    : Object.keys(brandData);

  // Markalara göre verileri grupla (sadece seçili markalar)
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

  // Tarihleri sırala ve benzersiz hale getir
  const allDates = [...new Set(reportList
    .filter(item => brandsToShow.includes(item.brand))
    .map(item => item.tarih))].sort();

  if (allDates.length === 0) {
    setChartData(null);
    return;
  }

  // Chart.js veri yapısını oluştur
  const datasets = [];
  
  // Her marka için farklı renk
  const brandColors = {
    GaiaOliva: 'rgb(75, 192, 192)',
    Komili: 'rgb(255, 99, 132)',
    Marmarabirlik: 'rgb(255, 159, 64)'
  };

  // Fiyat türleri için stil
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

      // Sadece veri olan dataset'leri ekle
      if (data.some(value => value !== null)) {
        datasets.push({
          label: `${brand} - ${priceTypeLabels[priceType]}`,
          data: data,
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
    return dates.sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)
  };
    const getItemsForDate = (date) => {
    return reportList.filter(item => item.tarih === date);
  };
const getUniqueBrandsFromData = () => {
  if (reportList.length === 0) return Object.keys(brandData);
  
  const uniqueBrands = [...new Set(reportList.map(item => item.brand))];
  return uniqueBrands.sort();
};

// Orijinal generateChartData fonksiyonunu basitleştir
const generateChartData = () => {
  if (reportList.length === 0) {
    showNotification('Grafik oluşturmak için yeterli veri bulunmuyor.', 'error');
    return;
  }

  setShowChart(true);
  // useEffect otomatik olarak grafiği güncelleyecek
};
  // Geçici listeye fiyatları kaydeder
  const handleSaveToList = async (e) => {
  e.preventDefault();
  if (!priceInputs.online && !priceInputs.supermarket && !priceInputs.webSitesi) {
    showNotification('Lütfen en az bir fiyat alanı doldurun.', 'error');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatında bugünün tarihi
  

  const newEntry = {
    id: Date.now(),
    brand: selectedBrand,
    ...priceInputs,
    tarih: today // Tarih ekle
  };
  
  const updatedList = [...reportList, newEntry];
  setReportList(updatedList);
  setPriceInputs({ tanim: '', online: '', supermarket: '', webSitesi: '' });
  showNotification(`${selectedBrand} için fiyatlar listeye eklendi.`, 'success');

  try {
    await saveDataToFile(updatedList);
  } catch (error) {
    console.error('Veri kaydedilirken hata oluştu:', error);
    showNotification('Veri kaydedilemedi. Lütfen tekrar deneyin.', 'error');
  }
};

  // Listeden bir öğeyi siler
  const handleDeleteItem = (idToDelete) => {
    setReportList((prevList) => prevList.filter((item) => item.id !== idToDelete));
    showNotification('Öğe listeden başarıyla silindi.', 'success');
  };

  // Bildirim gösterme fonksiyonu
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  // Raporu JSON dosyası olarak indirir
  const handleSaveReport = () => {
    if (reportList.length === 0) {
      showNotification('Kaydedilecek veri bulunmuyor. Lütfen önce listeye ekleme yapın.', 'error');
      return;
    }
    const dataStr = JSON.stringify(reportList, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'fiyat_raporu.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showNotification('Rapor başarıyla "fiyat_raporu.json" olarak indirildi!', 'success');
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen font-sans">
      {/* --- Header --- */}
      <header className="bg-[#131921] p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Fiyat Raporu</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {/* --- Marka Seçim Alanı --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="bg-gray-50 w-full sm:w-auto flex-grow border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            >
              {Object.keys(brandData).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <div className="bg-white p-2 rounded-md h-[56px] flex items-center justify-center border">
              <img
                src={currentBrand.logo}
                alt={`${selectedBrand} Logosu`}
                className="h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* --- Link Butonları --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Hızlı Erişim Linkleri</h2>
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

        {/* --- Fiyat Giriş Formu --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Fiyat Bilgisi Ekle</h2>
          <form onSubmit={handleSaveToList} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Marka</label>
              <input
                type="text"
                value={selectedBrand}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 cursor-not-allowed"
              />
            </div>
            {/* --- YENİ TANIM INPUTU --- */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Tanım</label>
              <input
                type="text"
                name="tanim"
                placeholder="örn: 5L Teneke"
                value={priceInputs.tanim}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Online Fiyat</label>
              <input
                type="number"
                name="online"
                placeholder="örn: 250.50"
                value={priceInputs.online}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Süpermarket Fiyatı</label>
              <input
                type="number"
                name="supermarket"
                placeholder="örn: 260.00"
                value={priceInputs.supermarket}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Web Sitesi Fiyatı</label>
              <input
                type="number"
                name="webSitesi"
                placeholder="örn: 245.90"
                value={priceInputs.webSitesi}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              className="w-full md:col-span-1 bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors h-[42px] border border-yellow-600 shadow-sm"
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fiyat Değişim Grafiği</h2>
            <p className="text-sm text-gray-600 mt-1">Marka fiyat analizleri</p>
          </div>
          <button
            onClick={() => {
              setShowChart(false);
              setSelectedChartBrands([]);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
            aria-label="Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Brand Selection Panel - Left Side */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Gösterilecek Markalar</h3>
            <div className="text-sm text-gray-500 mt-1 bg-white px-2 py-1 rounded-full inline-block text-center">
              {selectedChartBrands.length === 0 
                ? "Tümü seçili" 
                : `${selectedChartBrands.length} seçili`}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {getUniqueBrandsFromData().map(brand => (
                <label 
                  key={brand} 
                  className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
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
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className={`font-medium ${
                    selectedChartBrands.includes(brand) ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => setSelectedChartBrands(getUniqueBrandsFromData())}
              className="w-full text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              Tümünü Seç
            </button>
            <button
              onClick={() => setSelectedChartBrands([])}
              className="w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Chart Area - Right Side */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 h-full">
              {chartData && chartData.datasets.length > 0 ? (
                <div className="h-[500px]"> {/* Increased height from 96 (384px) to 500px */}
                  <Line 
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              // Use a function to customize labels
                              generateLabels: function(chart) {
                                const datasets = chart.data.datasets;
                                const uniqueBrands = [...new Set(datasets.map(ds => ds.label.split(' - ')[0]))];
                                
                                return uniqueBrands.map(brand => {
                                  // Find the first dataset for this brand to get its color
                                  const firstDataset = datasets.find(ds => ds.label.startsWith(brand));
                                  return {
                                    text: brand, // Just the brand name
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
                              padding: 15,
                              boxWidth: 10,
                              font: {
                                size: 12
                              }
                            }
                          },
                        title: {
                          display: true,
                          text: 'Fiyat Değişim Analizi',
                          font: {
                            size: 14,
                            weight: 'bold'
                          },
                          padding: {
                            top: 10,
                            bottom: 20
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: '#4f46e5',
                          borderWidth: 1,
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          mode: 'index',
                          intersect: false,
                          callbacks: {
                            title: function(tooltipItems) {
                              // Tarih bilgisini göster
                              return tooltipItems[0].label;
                            },
                            label: function(context) {
                              const currentValue = context.parsed.y;
                              const dataset = context.dataset;
                              const dataIndex = context.dataIndex;
                              
                              // Bir önceki değeri bul
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
                                  percentageText = ` Artış: %${percentage}`;
                                } else if (difference < 0) {
                                  differenceText = ` (${differenceFormatted} TL)`;
                                  percentageText = ` Azalış: %${Math.abs(percentage)}`;
                                } else {
                                  differenceText = ` (0.00 TL)`;
                                  percentageText = ` Değişim: %0.0`;
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
                              size: 12
                            }
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Tarih',
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">Veri Bulunamadı</h3>
                    <p className="text-gray-500 text-sm max-w-md">
                      Seçili markalara ait fiyat verisi mevcut değil veya tüm markaları kaldırdınız.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={() => {
            setShowChart(false);
            setSelectedChartBrands([]);
          }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
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
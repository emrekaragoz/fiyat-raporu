// src/App.jsx
import React, { useState, useEffect } from 'react';
import dataFromFile from './data/data.json';

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
  const [selectedBrand, setSelectedBrand] = useState('GaiaOliva');
  const [priceInputs, setPriceInputs] = useState({
    tanim: '', // Yeni "Tanım" alanı eklendi
    online: '',
    supermarket: '',
    webSitesi: '',
  });
  const [reportList, setReportList] = useState([]);
  const [notification, setNotification] = useState('');

  const currentBrand = brandData[selectedBrand];

  useEffect(() => {
    // Dosyadan gelen veriyi state'e set et
    setReportList(dataFromFile);
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

        {/* --- Kaydedilenler Listesi --- */}
        {reportList.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Kaydedilen Fiyatlar</h2>
  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
    {reportList.map((item) => (
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
          <span className="text-xs text-gray-500 ml-2">({item.tarih})</span>
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
        <div className="text-center mt-10">
          <button
            onClick={handleSaveReport}
            className="bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-extrabold py-3 px-8 rounded-lg transition-all text-lg shadow-lg transform hover:scale-105 border border-yellow-600"
          >
            Raporu Kaydet
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
    </div>
  );
}
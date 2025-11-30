// ====================================================================
// js/matematik_data.js
// Matematik Dersi Tüm Veri Kaynağı (Flashcard, Taktikler, Quizler)
// ====================================================================

// A) KONU BAZLI QUIZLER (Henüz Veri Girişi Yapılmadı)
const matematikKonuQuizler = [
    // Lütfen Konu Quizlerini buraya ekleyin (ID: 1, 2, 3...)
];

// B) DENEME SINAVLARI (Henüz Veri Girişi Yapılmadı)
const matematikDenemeler = [
    // Lütfen Deneme Sınavlarını buraya ekleyin (ID: 11, 12, 13...)
];

// TARTIŞMA: Quiz sayfalarında tek bir diziden ID ile arama yapmak için birleştirilmiş dizi.
const tumMatematikQuizler = [...matematikKonuQuizler, ...matematikDenemeler];


// C) FLASHCARDLAR (Konu Bazlı Tanımlar ve Kurallar)
const matematikFlashcards = [
    {
        konu: "1. Tam Sayılarla İşlemler",
        kartlar: [
            { on: "Mutlak Değer Tanımı", arka: "Bir tam sayının 0’a (sıfır) uzaklığına o tam sayının mutlak değeri adı verilir. Örneğin $|–7|$" },
            { on: "Toplama (Aynı İşaret)", arka: "Tam sayıların mutlak değerleri toplanır ve toplamın başına, tam sayıların ortak işareti konulur." },
            { on: "Toplama (Zıt İşaret)", arka: "Mutlak değerce büyük olan sayının mutlak değerinden, küçük olanın mutlak değeri çıkarılır. Farkın başına, mutlak değeri büyük olan tam sayının işareti konulur. Mutlak değerleri eşit olan zıt işaretli iki tam sayının toplamı sıfırdır." },
            { on: "Örnek Problem (Bölme)", arka: "(–1000) tam sayısının (+2) tam sayısına bölünmesiyle bulunur: $(–1000) : (+2) = –500$." },
            { on: "Çarpma (Etkisiz Eleman)", arka: "Bir tam sayının 1 ile çarpımı o tam sayının kendisine eşittir. Tam sayılarla çarpma işleminin etkisiz elemanı +1’dir." },
            { on: "Çarpma (Toplama Tersi)", arka: "0 (sıfır) hariç bir tam sayının (–1) ile çarpımı, o tam sayının toplama işlemine göre tersine eşittir. Örneğin, $(+7) \cdot (–1) = –7$ ve $(–4) \cdot (–1) = +4$." }
        ]
    },
    {
        konu: "2. Tam Sayılarla Üslü İfadeler",
        kartlar: [
            { on: "Negatif Tabanın İşareti", arka: "Negatif tam sayıların kuvvetleri belirlenirken parantez göz önünde bulundurulur: Tek kuvvetleri negatiftir, çift kuvvetleri pozitiftir." },
            { on: "Örnek (Kuvvet Değeri)", arka: "Taban negatif, kuvvet çift olduğu için sonuç pozitiftir: $(-2) \cdot (-2) \cdot (-2) \cdot (-2) = +16$." },
            { on: "Özel Durumlar (0 ve 1)", arka: "1 tam sayısının tüm kuvvetlerinin değeri 1’dir. 0 tam sayısının 0 hâriç tüm doğal sayı kuvvetlerinin değeri 0’dır." }
        ]
    },
    {
        konu: "3. Rasyonel Sayılar: Tanımlar ve Gösterim",
        kartlar: [
            { on: "Rasyonel Sayı Tanımı", arka: "a ve b tam sayı ve $b \neq 0$ olmak üzere, $\\frac{a}{b}$ biçiminde yazılabilen sayılara rasyonel sayı denir." },
            { on: "Ondalık Gösterim", arka: "Paydası 10’un kuvvetleri (10, 100, 1000) olan veya bu kuvvetlere dönüştürülebilen kesirler ondalık gösterim olarak yazılabilir." },
            { on: "Devirli Ondalık Gösterim", arka: "Ondalık kısmında tekrar eden sayıların olduğu gösterimlere denir. Tekrarlanan sayıların üzerine çizgi konur." },
            { on: "Devirliyi Rasyonel Yapma", arka: "Pay: Sayının tamamından, devretmeyen kısmı dışındaki sayı çıkarılır. Payda: Devreden kısım kadar 9 ve devretmeyen kısım kadar 0 yazılır." }
        ]
    },
    {
        konu: "4. Rasyonel Sayılar: İşlemler ve Özellikler",
        kartlar: [
            { on: "Rasyonel Sayılarla Toplama (Payda Eşitleme)", arka: "Önce sadeleştirme ya da genişletme yapılarak paydalar eşitlenir. Eşit paydalı kesirlerin payları toplanır veya çıkarılır." },
            { on: "Ters Eleman Özelliği (Toplama)", arka: "Toplamları sıfır olan iki rasyonel sayı toplama işlemine göre birbirlerinin tersidir." },
            { on: "Çarpma İşlemine Göre Ters", arka: "$a$ ve $b$ sıfırdan farklı olmak üzere $\\frac{a}{b}$ rasyonel sayısının çarpma işlemine göre tersi $\\frac{b}{a}$ rasyonel sayısıdır." },
            { on: "Bölme Kuralı", arka: "Birinci rasyonel sayı aynen yazılır. İkinci rasyonel sayının çarpma işlemine göre tersiyle (pay ve paydası yer değiştirilerek) çarpma işlemi yapılır." },
            { on: "Sıfıra Bölme", arka: "Bir rasyonel sayının 0'a (sıfır) bölümü **tanımsızdır**." },
            { on: "Çok Adımlı İşlem Önceliği", arka: "I. Üslü ifadeler, II. Parantez içleri, III. Çarpma/bölme (soldan sağa), IV. Toplama/çıkarma (soldan sağa) yapılır." },
            { on: "Üslü İfadeler (Karesi ve Küpü)", arka: "Karesi hesaplanırken rasyonel sayı kendisi ile çarpılır. Küpü hesaplanırken üç kez yan yana yazılır ve çarpılır." }
        ]
    },
    {
        konu: "5. Cebirsel İfadeler ve Denklemler",
        kartlar: [
            { on: "Cebirsel İfade Tanımı", arka: "Sayıların bilinmeyenlerle temsil edildiği matematik cümlesidir." },
            { on: "Değişken Tanımı", arka: "Cebirsel ifadelerde sayıları temsil eden harftir (bilinmeyen)." },
            { on: "Terim Tanımı", arka: "+ ve – işaretleri ile ayrılan her bir ifadeye denir." },
            { on: "Katsayı Tanımı", arka: "Terimlerin sayısal çarpanına katsayı denir." },
            { on: "Cebirsel İfade ile Çarpma", arka: "Doğal sayı ile cebirsel ifadedeki her bir terim ayrı ayrı çarpılır." },
            { on: "Sayı Örüntüsü Kuralı Bulma", arka: "Ardışık iki terim arasındaki fark bulunur. Bulunan bu değer, sayı örüntüsünün temsilcisi olan $n$’nin kat sayısı olarak yazılır." },
            { on: "Denklem Tanımı", arka: "İçinde en az bir bilinmeyenin bulunduğu eşitliğe denklem denir." },
            { on: "Birinci Dereceden Denklem", arka: "Denklemde bir adet değişken olmalı ve değişkenin kuvveti 1 olmalıdır." },
            { on: "Eşitliğin Korunumu (Toplama/Çıkarma)", arka: "Bir eşitliğin her iki tarafına aynı tam sayı eklenirse veya çıkarılırsa eşitlik korunur." },
            { on: "Eşitliğin Korunumu (Çarpma/Bölme)", arka: "Bir eşitliğin her iki tarafı aynı tam sayı ile çarpılırsa veya 0 hariç aynı tam sayıya bölünürse eşitlik korunur." }
        ]
    },
    {
        konu: "6. Oran, Orantı ve Yüzdeler (Temel)",
        kartlar: [
            { on: "Orantı Tanımı", arka: "İki veya daha fazla oranın eşitliğine orantı adı verilir." },
            { on: "Doğru Orantı Tanımı", arka: "Biri artarken diğeri de aynı oranda artıyorsa ya da biri azalırken diğeri de aynı oranda azalıyorsa doğru orantılıdır. Oranları daima sabittir ($k$)." },
            { on: "Ters Orantı Tanımı ve Kuralı", arka: "Biri artarken diğeri aynı oranda azalıyorsa ters orantılıdır. Çarpımları sabittir ($a \cdot b = k$)." },
            { on: "Örnek (Ters Orantı)", arka: "Ters orantıda çarpım sabittir: $20 \cdot 10 = 200$. $100 \cdot y = 200$, dolayısıyla $y=2$ olur." },
            { on: "Çokluğun Yüzdesini Bulma", arka: "Çokluk, yüzdelik ifadeye karşılık gelen kesirle çarpılır. ($a$ sayısının %$b$'si bulunurken $a \cdot \\frac{b}{100}$ işlemi yapılır.)" },
            { on: "Tamamını Bulma", arka: "Verilen değer, yüzdelik ifadeye karşılık gelen kesre bölünür. (%$c$'si $d$ olan bir sayı bulunurken $d : \\frac{c}{100}$ işlemi yapılır.)" },
            { on: "Yüzde Oranı Bulma", arka: "$a$ sayısının, $b$ sayısının yüzde kaçı olduğu $\\frac{a}{b}$ ifadesinin yüzdelik ifade şeklinde yazılmasıyla bulunur." }
        ]
    },
    {
        konu: "7. Geometri ve Ölçme (Tanımlar)",
        kartlar: [
            { on: "Eş Açılar Tanımı", arka: "Ölçüleri eşit olan açılara eş açılar adı verilir." },
            { on: "İç Ters Açı Tanımı", arka: "İki doğruyu üçüncü bir doğru kestiğinde, doğruların arasında ve kesenin her iki tarafındaki komşu olmayan açılardır." },
            { on: "Çokgen Tanımı", arka: "En az üç doğru parçasının uç uca birleştirilmesiyle oluşturulan kapalı şekillere denir." },
            { on: "İç Açı / Dış Açı", arka: "Ardışık iki kenarının oluşturduğu açıya iç açı, bu açının bütünlerine de dış açı denir." },
            { on: "Köşegen Sayısı Kuralı", arka: "n kenarlı bir çokgende, bir köşeden $(n-3)$ tane köşegen çizilebilir. Bu köşegenler çokgeni $(n-2)$ tane üçgensel bölgeye ayırır." },
            { on: "Düzgün Çokgen Tanımı", arka: "Kenar uzunlukları eşit olan ve iç açılarının ölçüleri birbirine eşit olan çokgenlere denir." },
            { on: "Merkez Açı Tanımı", arka: "Köşesi merkezde, uç noktaları çember üzerinde olan açıdır." },
            { on: "Merkez Açı ve Yay", arka: "Bir merkez açı ile merkez açının gördüğü yayın ölçüleri eşittir." },
            { on: "Çember Çevre Uzunluğu", arka: "Yarıçap uzunluğu $r$ olan çemberin çevre uzunluğu $Ç = 2 \pi r$ bağıntısı ile hesaplanır." },
            { on: "Daire Dilimi Alanı", arka: "Dairenin alanının daire dilimi merkez açısının 360 dereceye oranıyla bulunur: $\\pi r^2 \cdot \\frac{\\alpha}{360^{\\circ}}$." },
            { on: "Daire Tanımı", arka: "Çember ile çemberin iç bölgesinin birleşimine daire adı verilir." }
        ]
    },
    {
        konu: "8. Veri Analizi",
        kartlar: [
            { on: "Aritmetik Ortalama", arka: "Veri grubundaki sayıların toplamı, veri sayısına bölünür." },
            { on: "Ortanca Değer (Medyan)", arka: "Sayılar küçükten büyüğe sıralanır. Tek sayıda veride ortadaki sayı, çift sayıda veride ortadaki iki sayının aritmetik ortalamasıdır." },
            { on: "Tepe Değer (Mod)", arka: "Veri grubunda en çok tekrar eden sayı tepe değerdir. Tekrar eden değer yoksa mod yoktur." },
            { on: "Çizgi Grafiği Kullanımı", arka: "Zaman içinde değişen verileri (artış/azalış) göstermek için en uygun grafik türüdür." },
            { on: "Daire Grafiği Kullanımı", arka: "Bir veri grubunun bütün içindeki dağılımı/oranı gösterilmek istendiğinde kullanılır." },
            { on: "Grafik Hata Payı", arka: "Grafiklerin çizilirken başlangıç noktası ve birimlendirmenin eşit oranlı olmaması yanlış yorumlamalara yol açabilir." }
        ]
    },
    {
        konu: "9. Cisimlerin Farklı Yönlerden Görünümleri",
        kartlar: [
            { on: "Görünüm Çizimi", arka: "Üç boyutlu yapının görünümleri iki boyutlu olarak kareli kâğıda çizilebilir. (Ön, arka, sağ, sol ve üst görünümler)." },
            { on: "Simetri İlişkisi (Eş Küpler)", arka: "Eş küplerle oluşturulan yapıların önden ve arkadan görünümleri simetriktir. Aynı şekilde sağdan ve soldan görünümleri de simetriktir." }
        ]
    }
];


// D) ÇÖZÜM TAKTİKLERİ (Problem Çözme Yöntemleri)
const matematikTaktikler = [
    {
        konu: "1. Sayılar ve İşlemler (Tam Sayılar ve Üslü İfadeler)",
        taktikler: [
            { baslik: "Tam Sayı Toplama (Zıt İşaret)", aciklama: "Mutlak değerce büyük olan tam sayının işareti sonucun işareti olarak konulur. Mutlak değerleri eşit zıt işaretli iki tam sayının toplamı sıfırdır." },
            { baslik: "Toplama İşleminin Özellikleri", aciklama: "Akıcı bir şekilde tam sayılarla işlem yapmak için **Değişme, Birleşme, Ters Eleman ve Etkisiz Eleman** özellikleri kullanılabilir." },
            { baslik: "Çarpma İşlemi (Toplama Tersi)", aciklama: "Sıfır hariç bir tam sayıyı $(–1)$ ile çarpmak, o tam sayının toplama işlemine göre tersini bulmak anlamına gelir." },
            { baslik: "Bölme İşlemi Taktik", aciklama: "Sıfır hariç bir tam sayıyı $(-1)$ ile bölersek, bölüm bu tam sayının toplama işlemine göre ters işaretlisine eşit olur." },
            { baslik: "Üslü İfadeler (İşaret)", aciklama: "Negatif tam sayıların kuvvetlerinin işareti **parantez** göz önünde bulundurularak belirlenir; tek kuvvetleri negatiftir, çift kuvvetleri pozitiftir." },
            { baslik: "Üslü İfadeler (Tekrarlı Toplama)", aciklama: "Bir $x$ gerçek sayısının $n$ tane yan yana yazılıp toplanması cebirsel olarak $n \cdot x$ şeklinde gösterilir." },
            { baslik: "Üslü İfadeler (Tekrarlı Çarpım)", aciklama: "Bir $x$ gerçek sayısının $n$ tane yan yana yazılıp çarpılması $x^n$ şeklinde, yani $x$ sayısının $n$. kuvveti olarak gösterilir." }
        ]
    },
    {
        konu: "2. Rasyonel Sayılarla İşlemler",
        taktikler: [
            { baslik: "Rasyonel Sayı Toplama/Çıkarma", aciklama: "Paydalar eşit değilse ilk adım sadeleştirme ya da genişletme yapılarak paydaları eşitlemek olmalıdır." },
            { baslik: "Çarpma İşlemine Göre Ters", aciklama: "$\\frac{a}{b}$ rasyonel sayısının çarpma işlemine göre tersi $\\frac{b}{a}$ rasyonel sayısıdır. Çarpımları etkisiz elemanı (1) verir." },
            { baslik: "Rasyonel Sayılarla Bölme", aciklama: "Birinci rasyonel sayı aynen yazılır, ikinci rasyonel sayının çarpma işlemine göre tersiyle çarpılır ($\\frac{a}{b} \div \\frac{c}{d} = \\frac{a}{b} \cdot \\frac{d}{c}$)." },
            { baslik: "Çok Adımlı İşlemler (Sıra)", aciklama: "I. Üslü ifadeler, II. Parantez içleri, III. Çarpma/Bölme (soldan sağa), IV. Toplama/Çıkarma (soldan sağa)." },
            { baslik: "Çok Adımlı İşlemler (Kesir Çizgisi)", aciklama: "İşlem önceliği en uzun kesir çizgisine göre belirlenir; bölme işlemi yapılmadan önce pay ve paydadaki işlemler tamamlanmalıdır." }
        ]
    },
    {
        konu: "3. Cebirsel İfadeler ve Denklemler",
        taktikler: [
            { baslik: "Cebirsel İfadelerde Toplama/Çıkarma", aciklama: "Sadece **benzer terimlerin** katsayıları toplanarak veya çıkarılarak değişkene katsayı olarak yazılır. Benzer terim yoksa ifadeler aynen yazılır." },
            { baslik: "Sayı Örüntüsü Kuralı Bulma", aciklama: "1. Ardışık iki terim arasındaki fark bulunur ($n$'nin katsayısı). 2. Bu ifadede $n=1$ yazılarak 1. terimi elde edecek şekilde sayı eklenir ya da çıkarılır." },
            { baslik: "Denklem Çözme (Eşitlik Korunumu)", aciklama: "Sağ ve sol kefeye eşit sayıda kütle eklenirse, çıkarılırsa veya kütleler eşit katına çıkarılırsa eşitlik bozulmaz." },
            { baslik: "Denklem Kurma (Problem)", aciklama: "Bir sayının 4 katının 7 fazlası 43 olan sayıyı bulmak için $4x+7=43$ denklemi kurulur." },
            { baslik: "Orta Nokta Kayması (Tel/Çubuk)", aciklama: "Telin bir ucundan $x$ birim, diğer ucundan $y$ birim kesildiğinde, orta noktanın kayma miktarı: $\\frac{x - y}{2}$ formülü ile bulunur." }
        ]
    },
    {
        konu: "4. Oran, Orantı ve Yüzdeler",
        taktikler: [
            { baslik: "Orantı Kontrolü", aciklama: "İki oranın orantı oluşturup oluşturmadığı, oranlardan birinin diğerinin sadeleşmiş veya genişletilmiş hâli olup olmadığı incelenerek anlaşılır." },
            { baslik: "Orantı (İçler Dışlar Çarpımı)", aciklama: "Bir orantıda bilinmeyen bulunurken kullanılan temel kural: İçler çarpımı dışlar çarpımına eşittir ($a:b = c:d$ ise $a \cdot d = b \cdot c$)." },
            { baslik: "Ters Orantı Kuralı", aciklama: "İki çokluk $a$ ve $b$ ters orantılı ise çarpımları sabittir: $a \cdot b = k$ ($k$ orantı sabiti). Biri artarken diğeri aynı oranda azalır." },
            { baslik: "Yüzde Hesaplama (Artırma/Azaltma)", aciklama: "Bir sayıyı %10 oranında azaltmak demek, sayıyı 0.9 ile çarpmak demektir." },
            { baslik: "Kâr/Zarar Hesaplama Yöntemi", aciklama: "Maliyet fiyatı genellikle 100 alınarak işlem yapılır. Kâr = Satış fiyatı – Alış fiyatı; Zarar = Alış fiyatı – Satış fiyatı." }
        ]
    },
    {
        konu: "5. Problem Çözme Taktikleri (Özel Problemler)",
        taktikler: [
            { baslik: "İşçi Problemleri (Rasyonel Yöntem)", aciklama: "Bir işçi bir işin tamamını $x$ saatte yapıyorsa, 1 saatte işin $\\frac{1}{x}$’ini yapar. İki işçinin birlikte çalışma süresi $t$ için: $(\\frac{1}{x} + \\frac{1}{y}) \cdot t = 1$." },
            { baslik: "Hareket (Aynı Yön)", aciklama: "Aynı yönde hareket eden, $V_1 > V_2$ hızlı iki araç arasındaki $X$ mesafesi, hızların farkına bölünerek kapanma süresi bulunur: $t = \\frac{X}{V_1 - V_2}$." },
            { baslik: "Hareket (Zıt Yön)", aciklama: "Zıt yönde hareket eden iki araç arasındaki $X$ mesafesi, hızların toplamına bölünerek karşılaşma süresi bulunur: $t = \\frac{X}{V_1 + V_2}$." },
            { baslik: "Karışım Problemleri (Kap Yöntemi)", aciklama: "Ağırlık/Miktar $\\times$ Yüzde kuralı kullanılır: $A \cdot \%x + B \cdot \%y = (A+B) \cdot \%z$ ($z$ yeni yüzde)." },
            { baslik: "Karışım Problemleri (Saf Madde)", aciklama: "Bir karışıma tuz (saf madde) eklenirse, bu tuzun yüzde oranı **%100** alınır (saf su için %0)." },
            { baslik: "Yaş Problemleri (Fark)", aciklama: "İki kişinin yaşları arasındaki fark **hiçbir zaman değişmez**." },
            { baslik: "Hediyeleşme/Tokalaşma (n Kişi)", aciklama: "Hediyeleşme sayısı $n \cdot (n-1)$. Tokalaşma sayısı $\\frac{n \cdot (n-1)}{2}$ olur." }
        ]
    },
    {
        konu: "6. Geometri ve Veri Analizi",
        taktikler: [
            { baslik: "Çokgenler (Köşegen)", aciklama: "$n$ kenarlı bir çokgende bir köşeden $(n-3)$ tane köşegen çizilebilir ve $(n-2)$ tane üçgen oluşur." },
            { baslik: "Daire Alanı", aciklama: "Yarıçapı $r$ olan bir dairenin alanı $\\pi r^2$ bağıntısı ile hesaplanır." },
            { baslik: "Grafik Seçimi (Değişim)", aciklama: "Verilerin zaman içindeki artış/azalış miktarını göstermek için en uygun grafik **Çizgi Grafiğidir**." },
            { baslik: "Grafik Seçimi (Bütün-Parça)", aciklama: "Bir bütünün parçalara göre dağılımını veya oranını göstermek için en uygun grafik **Daire Grafiğidir**." },
            { baslik: "Grafik Yanıltma Taktik", aciklama: "Çizgi grafiklerinde yanlış yorumlamaya yol açan temel etken, **başlangıç noktası ve birimlendirmenin eşit oranlı olmamasıdır**." },
            { baslik: "Merkez Açı - Yay İlişkisi (Çember)", aciklama: "Bir çemberde merkez açının ölçüsü ile gördüğü yayın ölçüsü **birbirine eşittir**." },
            { baslik: "Veri Analizi (Mod / Tepe Değer)", aciklama: "Veri grubunda tekrar eden bir değer yoksa ya da tüm değerler eşit sayıda tekrar ediyorsa tepe değer (mod) **yoktur**." }
        ]
    }
];

import type { LandingLocale } from '@/lib/landing'

type LandingCopy = {
  title: string; description: string; eyebrow: string; heading: string; signature: string
  intro: string; cta: string; viewWork: string; languageNote: string; photoCaption: string
  trust: { value: string; label: string }[]
  servicesEyebrow: string; servicesTitle: string; servicesIntro: string
  services: { title: string; description: string; priceNote: string; includes: string[] }[]
  preWeddingTitle: string; preWeddingText: string
  portfolioEyebrow: string; portfolioTitle: string; portfolioIntro: string; galleryAlt: string[]
  artistEyebrow: string; artistTitle: string; artistText: string; reviews: string
  locationsEyebrow: string; locationsTitle: string; locations: { title: string; text: string }[]
  stepsEyebrow: string; stepsTitle: string; steps: { title: string; text: string }[]
  faqEyebrow: string; faqTitle: string; faqs: { question: string; answer: string }[]
  contactEyebrow: string; contactTitle: string; contactText: string; messageChecklist: string
  messageItems: string[]; availabilityNote: string; footerDescription: string; rights: string
}

export const landingCopy: Record<LandingLocale, LandingCopy> = {
  en: {
    title: 'Wedding Hair & Makeup in Japan, Hokkaido & Sapporo | Hitomi',
    description: 'Bridal hair and makeup in Japan, based in Sapporo, Hokkaido. Salon and hotel preparation for weddings and pre-wedding photos. Enquire with Hitomi on Instagram.',
    eyebrow: 'Japan · Hokkaido · Sapporo',
    heading: 'Wedding hair & makeup in Japan', signature: 'a little more you.',
    intro: 'For your wedding day or pre-wedding photographs. Thoughtful makeup and beautiful hair, with Hitomi in Sapporo, Hokkaido — and travel elsewhere in Japan on request.',
    cta: 'Enquire on Instagram', viewWork: 'Explore the work',
    languageNote: 'Personal consultations are in English or Japanese.',
    photoCaption: 'Bridal beauty · Hair & makeup by Hitomi.',
    trust: [{ value: '12+', label: 'years of bridal experience' }, { value: 'English & Japanese', label: 'personal communication' }, { value: 'Salon or hotel', label: 'get ready your way' }],
    servicesEyebrow: 'Your day, your setting', servicesTitle: 'Beauty, without the rush.',
    servicesIntro: 'Choose a salon appointment in Sapporo or get ready at your hotel. Both bridal services bring together makeup, hairstyling and a consultation to plan your look.',
    services: [
      { title: 'At the salon', description: 'A bridal hair and makeup appointment at a Sapporo salon, tailored to your features, outfit and preferred style.', priceNote: 'Starting price · final quote after consultation', includes: ['Pre-wedding consultation', 'Skin preparation & bridal makeup', 'Bridal hairstyling & lashes'] },
      { title: 'At your hotel', description: 'Hitomi brings her kit to your hotel room, so you can prepare your wedding look where you are staying.', priceNote: 'Starting price · Sapporo city travel included', includes: ['Pre-wedding consultation', 'Skin preparation & bridal makeup', 'Bridal hairstyling & lashes'] },
    ],
    preWeddingTitle: 'Planning pre-wedding photographs?', preWeddingText: 'Share your shoot date, getting-ready location and the time you need to be ready. Hitomi will discuss the right hair and makeup service and quote. Photography, dresses and transport are arranged separately.',
    portfolioEyebrow: 'A closer look', portfolioTitle: 'Soft details. Your own beauty.',
    portfolioIntro: 'A selection of Hitomi’s bridal makeup and hairstyles from the existing portfolio.',
    galleryAlt: ['Natural bridal makeup and an elegant updo, Sapporo', 'Soft glam bridal makeup, Hokkaido', 'Bridal makeup with a veil, Hokkaido', 'Bridal makeup and half-down hair, Sapporo', 'Bridal updo with gold hair pins, Hokkaido', 'Half-up bridal hairstyle with pearl pins, Sapporo'],
    artistEyebrow: 'Meet your artist', artistTitle: 'A familiar face, far from home.',
    artistText: 'Hitomi is a bridal makeup artist and hairstylist based in Sapporo, with over 12 years of bridal experience. Plan your look together in English or Japanese, whether you are visiting Hokkaido or arranging a wedding elsewhere in Japan.', reviews: 'Read client reviews on Google',
    locationsEyebrow: 'From Sapporo, with care', locationsTitle: 'Japan. Hokkaido. Sapporo.',
    locations: [{ title: 'Sapporo', text: 'Salon appointments and hotel preparation in the city. Travel within Sapporo is included in the hotel bridal service.' }, { title: 'Hokkaido', text: 'Getting married in Niseko, Lake Toya or elsewhere in Hokkaido? Share your location to discuss availability, travel and accommodation costs.' }, { title: 'Japan', text: 'Travel elsewhere in Japan is available on request. Your date, location and schedule determine availability and the individual quote.' }],
    stepsEyebrow: 'Simply, personally', stepsTitle: 'It starts with a conversation.',
    steps: [{ title: 'Say hello on Instagram', text: 'Send Hitomi your date, location, preferred service and ready-by time.' }, { title: 'Plan the details together', text: 'Hitomi personally checks availability and discusses your look, travel and quote.' }, { title: 'Confirm directly with Hitomi', text: 'Booking arrangements, payment and any changes are handled personally through Instagram.' }],
    faqEyebrow: 'Before you say hello', faqTitle: 'A few helpful answers.',
    faqs: [
      { question: 'Can I book hair and makeup for pre-wedding photos?', answer: 'Enquire with your shoot date and location. Hitomi will discuss preparation for your photos and the suitable hair and makeup service. Photography is not included.' },
      { question: 'Can we communicate in Chinese?', answer: 'This page is also available in Traditional Chinese, but personal consultations are in English or Japanese. Please send your Instagram enquiry in one of these languages.' },
      { question: 'Do you travel outside Sapporo?', answer: 'Yes, travel across Hokkaido and elsewhere in Japan is available on request, subject to availability. Travel and accommodation outside Sapporo are quoted separately.' },
      { question: 'How far ahead should I enquire?', answer: 'Around three months ahead is recommended for bridal appointments. If your date is closer, you can still enquire; Hitomi will check availability personally.' },
      { question: 'What about early starts, duration and touch-ups?', answer: 'Tell Hitomi the time you need to be ready. Early morning appointments may carry a surcharge. Duration, trials and any ongoing touch-ups should be agreed directly; all-day touch-ups are not automatically included.' },
      { question: 'How do payment and cancellation work?', answer: 'Hitomi explains the applicable payment and cancellation terms directly when arranging your booking. Sending an Instagram message is an enquiry and does not reserve a date.' },
    ],
    contactEyebrow: 'Let’s plan your look', contactTitle: 'Your Japan wedding starts here.',
    contactText: 'A message is all it takes to start. Hitomi personally handles your enquiry and booking on Instagram.',
    messageChecklist: 'Include these details in your message', messageItems: ['Service date (or let us know it is undecided)', 'City, hotel or wedding venue', 'Wedding or pre-wedding hair & makeup', 'The time you need to be ready'],
    availabilityNote: 'Your date is reserved only after Hitomi confirms the arrangements with you.',
    footerDescription: 'Bridal hair & makeup, based in Sapporo, Hokkaido. Travel across Japan on request. Personal communication in English & Japanese.', rights: 'All rights reserved.',
  },
  'zh-hk': {
    title: '日本・北海道・札幌婚禮及婚紗攝影化妝造型 | Hitomi',
    description: 'Hitomi 以北海道札幌為據點，提供婚禮及婚紗攝影化妝與髮型服務，可於沙龍或酒店準備造型。日本其他地區可按檔期安排出差。透過 Instagram 查詢。',
    eyebrow: '日本 · 北海道 · 札幌', heading: '日本婚禮及婚紗攝影化妝造型', signature: '展現最自然的你。',
    intro: '為婚禮當天或婚紗攝影，打造屬於你的妝容與髮型。Hitomi 以北海道札幌為據點，日本其他地區可按檔期及報價安排出差服務。',
    cta: 'Instagram 查詢檔期', viewWork: '查看作品', languageNote: '此網頁提供中文翻譯；Hitomi 本人以英語或日語溝通。', photoCaption: '新娘造型作品 · 化妝及髮型：Hitomi',
    trust: [{ value: '12+', label: '年新娘造型經驗' }, { value: '英語及日語', label: '直接與 Hitomi 溝通' }, { value: '沙龍或酒店', label: '選擇適合你的準備地點' }],
    servicesEyebrow: '你的日子，你的選擇', servicesTitle: '從容準備，展現你的美。', servicesIntro: '可選擇札幌沙龍，或於入住的酒店準備。兩項新娘服務均包括化妝、髮型及事前造型諮詢。',
    services: [
      { title: '沙龍新娘造型', description: '於札幌沙龍準備新娘妝容及髮型，按你的五官、服裝與喜好設計造型。', priceNote: '起價 · 諮詢後確認最終報價', includes: ['事前造型諮詢', '妝前準備及新娘化妝', '新娘髮型及假眼睫毛'] },
      { title: '酒店新娘造型', description: 'Hitomi 攜帶化妝及髮型工具到你的酒店房間，讓你在熟悉的環境準備。', priceNote: '起價 · 包括札幌市內交通', includes: ['事前造型諮詢', '妝前準備及新娘化妝', '新娘髮型及假眼睫毛'] },
    ],
    preWeddingTitle: '正在安排婚紗攝影？', preWeddingText: '請提供拍攝日期、準備地點及需要完成造型的時間，Hitomi 會與你確認適合的化妝髮型服務及報價。攝影、婚紗及交通需另外安排。',
    portfolioEyebrow: '細看每個細節', portfolioTitle: '細膩妝髮，呈現你的美。', portfolioIntro: '精選 Hitomi 現有作品集中的新娘化妝及髮型。',
    galleryAlt: ['札幌自然新娘妝容及優雅盤髮', '北海道柔和新娘妝容', '北海道頭紗新娘妝容', '札幌新娘妝容及半放髮造型', '北海道金色髮飾新娘盤髮', '札幌珍珠髮飾半束髮新娘造型'],
    artistEyebrow: '認識你的造型師', artistTitle: '在遠方，也能安心準備。', artistText: 'Hitomi 是以札幌為據點的新娘化妝及髮型師，擁有超過 12 年新娘造型經驗。不論你前往北海道，或在日本其他地區舉行婚禮，都可用英語或日語一起討論造型。', reviews: '查看 Google 客戶評價',
    locationsEyebrow: '從札幌出發', locationsTitle: '日本・北海道・札幌', locations: [{ title: '札幌', text: '提供沙龍及酒店新娘造型。酒店新娘服務包括札幌市內交通。' }, { title: '北海道', text: '於二世古、洞爺湖或北海道其他地區舉行婚禮？請提供地點，以確認檔期、交通及住宿費用。' }, { title: '日本', text: '日本其他地區可按需要安排出差。Hitomi 會按日期、地點及時間安排確認可行性與個別報價。' }],
    stepsEyebrow: '簡單，直接', stepsTitle: '從一段對話開始。', steps: [{ title: 'Instagram 私訊查詢', text: '告訴 Hitomi 日期、地點、所需服務及需要完成造型的時間。' }, { title: '一起確認細節', text: 'Hitomi 親自確認檔期，與你討論造型、交通安排及報價。' }, { title: '直接與 Hitomi 確認預約', text: '預約、付款及更改安排，均透過 Instagram 由 Hitomi 親自處理。' }],
    faqEyebrow: '查詢前的小提示', faqTitle: '你可能想知道的事。', faqs: [
      { question: '可以預約婚紗攝影的化妝及髮型嗎？', answer: '請提供拍攝日期與地點，Hitomi 會與你討論拍攝前的造型準備及合適服務。服務不包括攝影。' },
      { question: '可以用中文溝通嗎？', answer: '網頁提供繁體中文翻譯，但 Hitomi 本人以英語或日語溝通。請使用其中一種語言發送 Instagram 查詢。' },
      { question: '可以到札幌以外的地區嗎？', answer: '可按檔期安排北海道及日本其他地區的出差服務。札幌以外的交通與住宿費用會另外報價。' },
      { question: '應該提前多久查詢？', answer: '建議婚禮造型約提前三個月查詢。如日期較近，仍歡迎查詢，Hitomi 會親自確認檔期。' },
      { question: '清晨服務、造型時間及補妝如何安排？', answer: '請告訴 Hitomi 需要完成造型的時間。清晨服務可能需另加費用；服務時長、試妝及補妝安排需直接確認，並不預設包括全日補妝。' },
      { question: '付款及取消預約如何處理？', answer: 'Hitomi 會在安排預約時直接說明適用的付款及取消條件。發送 Instagram 私訊只是查詢，並不代表日期已預留。' },
    ],
    contactEyebrow: '一起規劃你的造型', contactTitle: '從這裏，開始你的日本婚禮。', contactText: '發送私訊，開始討論。Hitomi 會在 Instagram 親自處理你的查詢及預約。', messageChecklist: '私訊時請提供', messageItems: ['服務日期（未定也可先查詢）', '城市、酒店或婚禮場地', '婚禮或婚紗攝影化妝及髮型', '需要完成造型的時間'], availabilityNote: '日期需待 Hitomi 與你確認預約安排後，才算正式預留。', footerDescription: '以北海道札幌為據點的新娘化妝及髮型服務。日本各地可按需要安排出差。本人以英語及日語溝通。', rights: '版權所有。',
  },
  'zh-tw': {
    title: '日本・北海道・札幌婚禮與婚紗拍攝新娘妝髮 | Hitomi',
    description: 'Hitomi 以北海道札幌為據點，提供婚禮與婚紗拍攝新娘妝髮，可於沙龍或飯店完成造型。日本其他地區可依檔期安排到府服務。透過 Instagram 詢問。',
    eyebrow: '日本 · 北海道 · 札幌', heading: '日本婚禮與婚紗拍攝新娘妝髮', signature: '呈現最自然的妳。', intro: '為婚禮當天或婚紗拍攝，打造屬於妳的妝容與髮型。Hitomi 以北海道札幌為據點，日本其他地區可依檔期與報價安排出差服務。',
    cta: 'Instagram 詢問檔期', viewWork: '查看作品', languageNote: '此網頁提供中文翻譯；Hitomi 本人以英語或日語溝通。', photoCaption: '新娘造型作品 · 妝髮造型：Hitomi',
    trust: [{ value: '12+', label: '年新娘妝髮經驗' }, { value: '英語與日語', label: '直接與 Hitomi 溝通' }, { value: '沙龍或飯店', label: '選擇適合妳的準備地點' }],
    servicesEyebrow: '妳的日子，妳的選擇', servicesTitle: '從容準備，呈現妳的美。', servicesIntro: '可選擇札幌沙龍，或於入住的飯店準備。兩項新娘服務皆包含化妝、髮型與事前造型諮詢。', services: [
      { title: '沙龍新娘妝髮', description: '於札幌沙龍完成新娘妝髮，依照妳的五官、服裝與喜好設計造型。', priceNote: '起價 · 諮詢後確認最終報價', includes: ['事前造型諮詢', '妝前準備與新娘彩妝', '新娘髮型與假睫毛'] },
      { title: '飯店新娘妝髮', description: 'Hitomi 攜帶妝髮工具到妳的飯店房間，讓妳在熟悉的環境準備。', priceNote: '起價 · 包含札幌市內交通', includes: ['事前造型諮詢', '妝前準備與新娘彩妝', '新娘髮型與假睫毛'] },
    ],
    preWeddingTitle: '正在安排婚紗拍攝？', preWeddingText: '請提供拍攝日期、準備地點與需要完成造型的時間，Hitomi 會與妳確認適合的妝髮服務與報價。攝影、婚紗與交通需另外安排。',
    portfolioEyebrow: '細看每個細節', portfolioTitle: '細膩妝髮，呈現妳的美。', portfolioIntro: '精選 Hitomi 現有作品集中的新娘彩妝與髮型。', galleryAlt: ['札幌自然新娘彩妝與優雅盤髮', '北海道柔和新娘彩妝', '北海道頭紗新娘彩妝', '札幌新娘彩妝與半放髮造型', '北海道金色髮飾新娘盤髮', '札幌珍珠髮飾半束髮新娘造型'],
    artistEyebrow: '認識妳的造型師', artistTitle: '在遠方，也能安心準備。', artistText: 'Hitomi 是以札幌為據點的新娘彩妝與髮型師，擁有超過 12 年新娘妝髮經驗。不論妳前往北海道，或在日本其他地區舉行婚禮，都可用英語或日語一起討論造型。', reviews: '查看 Google 客戶評價',
    locationsEyebrow: '從札幌出發', locationsTitle: '日本・北海道・札幌', locations: [{ title: '札幌', text: '提供沙龍與飯店新娘妝髮。飯店新娘服務包含札幌市內交通。' }, { title: '北海道', text: '於二世古、洞爺湖或北海道其他地區舉行婚禮？請提供地點，以確認檔期、交通與住宿費用。' }, { title: '日本', text: '日本其他地區可依需求安排出差。Hitomi 會依日期、地點與時間安排確認可行性與個別報價。' }],
    stepsEyebrow: '簡單，直接', stepsTitle: '從一段對話開始。', steps: [{ title: 'Instagram 私訊詢問', text: '告訴 Hitomi 日期、地點、所需服務與需要完成造型的時間。' }, { title: '一起確認細節', text: 'Hitomi 親自確認檔期，與妳討論造型、交通安排與報價。' }, { title: '直接與 Hitomi 確認預約', text: '預約、付款與變更安排，皆透過 Instagram 由 Hitomi 親自處理。' }],
    faqEyebrow: '詢問前的小提醒', faqTitle: '妳可能想知道的事。', faqs: [
      { question: '可以預約婚紗拍攝的妝髮嗎？', answer: '請提供拍攝日期與地點，Hitomi 會與妳討論拍攝前的造型準備與合適服務。服務不包含攝影。' },
      { question: '可以用中文溝通嗎？', answer: '網頁提供繁體中文翻譯，但 Hitomi 本人以英語或日語溝通。請使用其中一種語言傳送 Instagram 詢問。' },
      { question: '可以到札幌以外的地區嗎？', answer: '可依檔期安排北海道與日本其他地區的出差服務。札幌以外的交通與住宿費用會另外報價。' },
      { question: '應該提前多久詢問？', answer: '建議婚禮妝髮約提前三個月詢問。如日期較近，仍歡迎詢問，Hitomi 會親自確認檔期。' },
      { question: '清晨服務、造型時間與補妝如何安排？', answer: '請告訴 Hitomi 需要完成造型的時間。清晨服務可能需另加費用；服務時長、試妝與補妝安排需直接確認，並不預設包含全日補妝。' },
      { question: '付款與取消預約如何處理？', answer: 'Hitomi 會在安排預約時直接說明適用的付款與取消條件。傳送 Instagram 私訊只是詢問，並不代表日期已保留。' },
    ],
    contactEyebrow: '一起規劃妳的造型', contactTitle: '從這裡，開始妳的日本婚禮。', contactText: '傳送私訊，開始討論。Hitomi 會在 Instagram 親自處理妳的詢問與預約。', messageChecklist: '私訊時請提供', messageItems: ['服務日期（未定也可先詢問）', '城市、飯店或婚禮場地', '婚禮或婚紗拍攝新娘妝髮', '需要完成造型的時間'], availabilityNote: '日期需待 Hitomi 與妳確認預約安排後，才算正式保留。', footerDescription: '以北海道札幌為據點的新娘妝髮服務。日本各地可依需求安排出差。本人以英語與日語溝通。', rights: '版權所有。',
  },
}

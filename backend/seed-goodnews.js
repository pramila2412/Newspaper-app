/**
 * GoodNews Seeder (MongoDB Native Driver)
 * Modified for correct schema and image URLs
 */

const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/goodnews";
const now = () => new Date();

const categories = [
    { name: "വാർത്ത (News)", slug: "news", order: 1 },
    { name: "ആത്മീയം (Spiritual)", slug: "spiritual", order: 2 },
    { name: "സാക്ഷ്യം (Testimony)", slug: "testimony", order: 3 },
    { name: "യുവജന (Youth)", slug: "youth", order: 4 },
    { name: "കുടുംബം (Family)", slug: "family", order: 5 },
    { name: "ലേഖനം (Article)", slug: "article", order: 6 },
    { name: "മുദ്രവാക്യം (Editorial)", slug: "editorial", order: 7 },
    { name: "അഭിമുഖം (Interview)", slug: "interview", order: 8 },
];

const mkSlug = (s) =>
    s.toLowerCase().replace(/[()]/g, "").replace(/&/g, "and").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const posts = [
    {
        category: "news",
        title_en: "Community Prayer Meet Brings Hope",
        title_ml: "സമൂഹ പ്രാർത്ഥന സംഗമം പ്രത്യാശ പകർന്നു",
        excerpt_en: "Believers gathered to pray for peace, families, and the nation.",
        excerpt_ml: "സമാധാനത്തിനും കുടുംബങ്ങൾക്കും രാജ്യത്തിനുമായി വിശ്വാസികൾ ഒരുമിച്ചു പ്രാർത്ഥിച്ചു.",
        keywords: "church news, prayer meeting, community",
    },
    {
        category: "news",
        title_en: "Local Church Launches Food Support Drive",
        title_ml: "പ്രാദേശിക സഭ ഭക്ഷ്യ സഹായ ക്യാമ്പ് ആരംഭിച്ചു",
        excerpt_en: "Volunteers distributed essentials to families in need.",
        excerpt_ml: "ആവശ്യക്കാരായ കുടുംബങ്ങൾക്ക് സന്നദ്ധ പ്രവർത്തകർ അവശ്യ സാധനങ്ങൾ വിതരണം ചെയ്തു.",
        keywords: "charity, food support, church volunteers",
    },
    {
        category: "news",
        title_en: "Youth Worship Night Draws Hundreds",
        title_ml: "യുവ ആരാധന രാത്രി നൂറുകണക്കിന് ആളുകളെ ആകർഷിച്ചു",
        excerpt_en: "An evening of music, prayer, and unity.",
        excerpt_ml: "സംഗീതവും പ്രാർത്ഥനയും ഏകത്വവും നിറഞ്ഞ സന്ധ്യ.",
        keywords: "youth event, worship night, church",
    },
    {
        category: "news",
        title_en: "Bible Study Conference Announced",
        title_ml: "ബൈബിൾ പഠന സമ്മേളനം പ്രഖ്യാപിച്ചു",
        excerpt_en: "Sessions will cover faith, purpose, and practical living.",
        excerpt_ml: "വിശ്വാസം, ലക്ഷ്യം, പ്രായോഗിക ജീവിതം എന്നീ വിഷയങ്ങൾ ഉൾപ്പെടും.",
        keywords: "conference, bible study, christian event",
    },
    {
        category: "news",
        title_en: "New Family Counseling Program Opens",
        title_ml: "കുടുംബ കൗൺസലിംഗ് പദ്ധതി ആരംഭിച്ചു",
        excerpt_en: "Support for couples, parents, and youth guidance.",
        excerpt_ml: "ദമ്പതികൾക്കും മാതാപിതാക്കൾക്കും യുവജന മാർഗ്ഗനിർദേശത്തിനും സഹായം.",
        keywords: "family counseling, support, church program",
    },
    {
        category: "news",
        title_en: "Christmas Outreach Planning Begins",
        title_ml: "ക്രിസ്മസ് ഔട്രീച്ച് പദ്ധതികൾ ആരംഭിച്ചു",
        excerpt_en: "Teams preparing gifts, visits, and care packages.",
        excerpt_ml: "സമ്മാനങ്ങളും സന്ദർശനങ്ങളും പരിചരണ കിറ്റുകളും ഒരുക്കുന്നു.",
        keywords: "outreach, christmas, care packages",
    },
    {
        category: "news",
        title_en: "Testimony Sunday Set for Next Month",
        title_ml: "അടുത്ത മാസം സാക്ഷ്യ ഞായർ",
        excerpt_en: "A special service focused on real-life stories of faith.",
        excerpt_ml: "വിശ്വാസത്തിന്റെ യഥാർത്ഥ ജീവിത സാക്ഷ്യങ്ങൾ പങ്കിടുന്ന പ്രത്യേക ശുശ്രൂഷ.",
        keywords: "testimony service, church, sunday",
    },
    {
        category: "news",
        title_en: "Volunteer Training for Media Team",
        title_ml: "മീഡിയ ടീമിന് സന്നദ്ധ പരിശീലനം",
        excerpt_en: "Training on camera, sound, and live streaming basics.",
        excerpt_ml: "ക്യാമറ, സൗണ്ട്, ലൈവ് സ്ട്രീമിംഗ് അടിസ്ഥാനങ്ങൾക്കായുള്ള പരിശീലനം.",
        keywords: "media team, training, live streaming",
    },

    {
        category: "spiritual",
        title_en: "A Simple Morning Prayer Routine",
        title_ml: "ലളിതമായ രാവിലെ പ്രാർത്ഥന ശീലം",
        excerpt_en: "Start your day with gratitude and a calm heart.",
        excerpt_ml: "കൃതജ്ഞതയും സമാധാനമുള്ള ഹൃദയവും കൊണ്ട് ദിവസം തുടങ്ങാം.",
        keywords: "prayer, morning routine, gratitude",
    },
    {
        category: "spiritual",
        title_en: "Finding Peace During Busy Days",
        title_ml: "തിരക്കുള്ള ദിവസങ്ങളിൽ സമാധാനം കണ്ടെത്തുക",
        excerpt_en: "Small pauses, scripture, and quiet reflection can reset your mind.",
        excerpt_ml: "ചെറിയ ഇടവേളകളും വചനവും ധ്യാനവും മനസ്സിനെ പുതുക്കും.",
        keywords: "peace, reflection, scripture",
    },
    {
        category: "spiritual",
        title_en: "How to Read the Bible Consistently",
        title_ml: "ബൈബിൾ സ്ഥിരമായി വായിക്കാൻ മാർഗങ്ങൾ",
        excerpt_en: "A practical plan you can follow without pressure.",
        excerpt_ml: "സമ്മർദ്ദമില്ലാതെ പിന്തുടരാവുന്ന പ്രായോഗിക പദ്ധതി.",
        keywords: "bible reading, discipline, faith",
    },
    {
        category: "spiritual",
        title_en: "Faith Over Fear",
        title_ml: "ഭയത്തിന് മുകളിൽ വിശ്വാസം",
        excerpt_en: "Trust grows when you focus on what God says, not what you feel.",
        excerpt_ml: "നമ്മൾ അനുഭവിക്കുന്നതിനെക്കാൾ ദൈവവചനം ശ്രദ്ധിക്കുമ്പോൾ വിശ്വാസം വളരും.",
        keywords: "faith, fear, trust",
    },
    {
        category: "spiritual",
        title_en: "Forgiveness That Frees the Heart",
        title_ml: "ഹൃദയം സ്വതന്ത്രമാക്കുന്ന ക്ഷമ",
        excerpt_en: "Forgiveness is a decision that heals both sides.",
        excerpt_ml: "ക്ഷമ ഒരു തീരുമാനമാണ്; അത് ഇരുവശവും സുഖപ്പെടുത്തുന്നു.",
        keywords: "forgiveness, healing, peace",
    },
    {
        category: "spiritual",
        title_en: "Grace for the Imperfect",
        title_ml: "അപൂർണ്ണർക്കുള്ള കൃപ",
        excerpt_en: "You don’t need to be perfect to be loved and led.",
        excerpt_ml: "സ്നേഹിക്കപ്പെടാനും നയിക്കപ്പെടാനും പൂർണ്ണത ആവശ്യമില്ല.",
        keywords: "grace, love, hope",
    },
    {
        category: "spiritual",
        title_en: "Worship at Home",
        title_ml: "വീട്ടിൽ ആരാധിക്കുക",
        excerpt_en: "Create a small space and time for worship in your daily life.",
        excerpt_ml: "ദൈനംദിന ജീവിതത്തിൽ ചെറിയ ഇടവും സമയവും ആരാധനയ്ക്കായി മാറ്റിവെക്കുക.",
        keywords: "worship, home, daily life",
    },
    {
        category: "spiritual",
        title_en: "Strength for Today",
        title_ml: "ഇന്നത്തെക്കായി ശക്തി",
        excerpt_en: "One verse, one prayer, one step at a time.",
        excerpt_ml: "ഒരു വചനം, ഒരു പ്രാർത്ഥന, ഓരോ പടി വീതം.",
        keywords: "strength, verse, prayer",
    },

    {
        category: "testimony",
        title_en: "A Door Opened When Everything Felt Closed",
        title_ml: "എല്ലാം അടഞ്ഞെന്നു തോന്നിയപ്പോൾ ഒരു വാതിൽ തുറന്നു",
        excerpt_en: "A job opportunity came unexpectedly after weeks of prayer.",
        excerpt_ml: "ആഴ്ചകളോളം പ്രാർത്ഥിച്ചതിന് ശേഷം അപ്രതീക്ഷിതമായി ജോലി അവസരം ലഭിച്ചു.",
        keywords: "testimony, breakthrough, prayer",
    },
    {
        category: "testimony",
        title_en: "Healed From Anxiety With Daily Prayer",
        title_ml: "ദൈനംദിന പ്രാർത്ഥന കൊണ്ട് ആശങ്കയിൽ നിന്ന് മോചനം",
        excerpt_en: "Slowly, peace replaced fear through steady faith habits.",
        excerpt_ml: "സ്ഥിരമായ വിശ്വാസ ശീലങ്ങളിലൂടെ ഭയത്തിന് പകരം സമാധാനം വന്നു.",
        keywords: "anxiety, healing, peace",
    },
    {
        category: "testimony",
        title_en: "Restored Relationship After Years",
        title_ml: "വർഷങ്ങൾക്ക് ശേഷം ബന്ധം പുനഃസ്ഥാപിച്ചു",
        excerpt_en: "Forgiveness began a new chapter for our family.",
        excerpt_ml: "ക്ഷമ നമ്മുടെ കുടുംബത്തിന് പുതിയ അധ്യായം തുടങ്ങി.",
        keywords: "family, forgiveness, restoration",
    },
    {
        category: "testimony",
        title_en: "Provision in a Difficult Month",
        title_ml: "കഠിനമായ മാസത്തിൽ ലഭിച്ച സഹായം",
        excerpt_en: "Help arrived just in time—food, rent, and encouragement.",
        excerpt_ml: "സമയത്ത് തന്നെ സഹായം വന്നു—ഭക്ഷണം, വാടക, പ്രോത്സാഹനം.",
        keywords: "provision, support, community",
    },
    {
        category: "testimony",
        title_en: "From Addiction to Freedom",
        title_ml: "ലഹരിയിൽ നിന്ന് സ്വാതന്ത്ര്യത്തിലേക്ക്",
        excerpt_en: "Support, prayer, and accountability changed everything.",
        excerpt_ml: "പിന്തുണയും പ്രാർത്ഥനയും ഉത്തരവാദിത്വവും എല്ലാം മാറ്റി.",
        keywords: "freedom, recovery, testimony",
    },
    {
        category: "testimony",
        title_en: "A New Start After Loss",
        title_ml: "നഷ്ടത്തിന് ശേഷം പുതിയ തുടക്കം",
        excerpt_en: "Grief became gentler as hope returned day by day.",
        excerpt_ml: "ദിവസംതോറും പ്രത്യാശ മടങ്ങിയപ്പോൾ ദുഃഖം മൃദുവായി.",
        keywords: "hope, grief, comfort",
    },
    {
        category: "testimony",
        title_en: "Answered Prayer for a Child’s Health",
        title_ml: "കുട്ടിയുടെ ആരോഗ്യത്തിനായുള്ള പ്രാർത്ഥനയ്ക്ക് മറുപടി",
        excerpt_en: "Medical reports improved steadily, and our faith grew stronger.",
        excerpt_ml: "മെഡിക്കൽ റിപ്പോർട്ടുകൾ മെച്ചപ്പെട്ടു; നമ്മുടെ വിശ്വാസം ശക്തമായി.",
        keywords: "healing, child, prayer",
    },
    {
        category: "testimony",
        title_en: "Peace in the Middle of a Storm",
        title_ml: "പ്രളയത്തിനിടയിൽ സമാധാനം",
        excerpt_en: "Even without all answers, we experienced calm and clarity.",
        excerpt_ml: "മുഴുവൻ ഉത്തരങ്ങൾ ഇല്ലെങ്കിലും നാം സമാധാനവും വ്യക്തതയും അനുഭവിച്ചു.",
        keywords: "peace, storm, faith",
    },

    {
        category: "youth",
        title_en: "Youth Camp: 3 Days of Faith & Fun",
        title_ml: "യുവ ക്യാമ്പ്: വിശ്വാസവും സന്തോഷവും നിറഞ്ഞ 3 ദിവസം",
        excerpt_en: "Games, worship, and life lessons that stick.",
        excerpt_ml: "കളികളും ആരാധനയും മനസ്സിൽ നിൽക്കുന്ന ജീവിത പാഠങ്ങളും.",
        keywords: "youth camp, worship, friends",
    },
    {
        category: "youth",
        title_en: "How Teens Can Build Strong Habits",
        title_ml: "ടീൻസ് നല്ല ശീലങ്ങൾ എങ്ങനെ വളർത്താം",
        excerpt_en: "Small routines beat big plans that never start.",
        excerpt_ml: "തുടങ്ങാത്ത വലിയ പദ്ധതികളേക്കാൾ ചെറിയ ശീലങ്ങൾ മികച്ചതാണ്.",
        keywords: "habits, teens, growth",
    },
    {
        category: "youth",
        title_en: "Leading With Humility",
        title_ml: "വിനയം കൊണ്ട് നേതൃത്വം",
        excerpt_en: "Real leaders serve first and speak with kindness.",
        excerpt_ml: "യഥാർത്ഥ നേതാക്കൾ ആദ്യം സേവിക്കുന്നു; സ്നേഹത്തോടെ സംസാരിക്കുന്നു.",
        keywords: "leadership, humility, youth",
    },
    {
        category: "youth",
        title_en: "Social Media With Wisdom",
        title_ml: "സോഷ്യൽ മീഡിയ ജ്ഞാനത്തോടെ",
        excerpt_en: "Use platforms to build, not to break.",
        excerpt_ml: "പണിയാൻ ഉപയോഗിക്കുക; തകർക്കാൻ അല്ല.",
        keywords: "social media, wisdom, youth",
    },
    {
        category: "youth",
        title_en: "Friendships That Strengthen Faith",
        title_ml: "വിശ്വാസം ശക്തിപ്പെടുത്തുന്ന സുഹൃത്തുക്കൾ",
        excerpt_en: "Choose people who pull you closer to purpose.",
        excerpt_ml: "ലക്ഷ്യത്തിലേക്ക് അടുത്താക്കുന്ന ആളുകളെ തിരഞ്ഞെടുക്കുക.",
        keywords: "friendship, faith, youth",
    },
    {
        category: "youth",
        title_en: "Youth Worship Setlist: Simple & Powerful",
        title_ml: "യുവ ആരാധന പാട്ടുപട്ടിക: ലളിതവും ശക്തവുമുള്ളത്",
        excerpt_en: "A starter list for small groups and gatherings.",
        excerpt_ml: "ചെറിയ ഗ്രൂപ്പുകൾക്കും സംഗമങ്ങൾക്കും ഒരു സ്റ്റാർട്ടർ പട്ടിക.",
        keywords: "worship songs, setlist, youth",
    },
    {
        category: "youth",
        title_en: "Study + Faith: Balancing Both",
        title_ml: "പഠനം + വിശ്വാസം: രണ്ടും ബാലൻസ് ചെയ്യുക",
        excerpt_en: "Time blocks, prayer breaks, and focused goals.",
        excerpt_ml: "ടൈം ബ്ലോക്കുകളും പ്രാർത്ഥന ഇടവേളകളും ലക്ഷ്യങ്ങളും.",
        keywords: "study, balance, faith",
    },
    {
        category: "youth",
        title_en: "Serving in Church as a Teen",
        title_ml: "ടീനായിരിക്കുമ്പോൾ സഭയിൽ സേവനം",
        excerpt_en: "Start small—help, learn, grow, and lead.",
        excerpt_ml: "ചെറിയതായി തുടങ്ങുക—സഹായിക്കുക, പഠിക്കുക, വളരുക, നയിക്കുക.",
        keywords: "service, volunteering, youth",
    },

    {
        category: "family",
        title_en: "Family Prayer: Keeping It Simple",
        title_ml: "കുടുംബ പ്രാർത്ഥന: ലളിതമായി തുടരാം",
        excerpt_en: "Five minutes daily can change the atmosphere at home.",
        excerpt_ml: "ദിവസം അഞ്ച് മിനിറ്റ് വീട്ടിലെ അന്തരീക്ഷം മാറ്റും.",
        keywords: "family prayer, home, routine",
    },
    {
        category: "family",
        title_en: "Raising Kids With Kindness",
        title_ml: "കുട്ടികളെ കരുണയോടെ വളർത്തുക",
        excerpt_en: "Discipline works best when love is visible.",
        excerpt_ml: "സ്നേഹം കാണപ്പെടുമ്പോഴാണ് ശിക്ഷണം ഫലപ്രദമാകുന്നത്.",
        keywords: "parenting, kindness, kids",
    },
    {
        category: "family",
        title_en: "Marriage: Communication That Heals",
        title_ml: "വിവാഹം: സുഖപ്പെടുത്തുന്ന സംഭാഷണം",
        excerpt_en: "Listen first, speak gently, and solve together.",
        excerpt_ml: "ആദ്യം കേൾക്കുക, മൃദുവായി സംസാരിക്കുക, ഒരുമിച്ച് പരിഹരിക്കുക.",
        keywords: "marriage, communication, healing",
    },
    {
        category: "family",
        title_en: "Handling Conflicts at Home",
        title_ml: "വീട്ടിലെ സംഘർഷങ്ങൾ കൈകാര്യം ചെയ്യുക",
        excerpt_en: "Pause, pray, and respond—don’t react.",
        excerpt_ml: "താമസിക്കുക, പ്രാർത്ഥിക്കുക, പ്രതികരിക്കുക — പ്രതികരിക്കാതെ.",
        keywords: "conflict, family, peace",
    },
    {
        category: "family",
        title_en: "Building a Home of Hope",
        title_ml: "പ്രത്യാശ നിറഞ്ഞ വീട് നിർമ്മിക്കുക",
        excerpt_en: "Create traditions that bring faith into daily life.",
        excerpt_ml: "ദൈനംദിനത്തിലേക്ക് വിശ്വാസം കൊണ്ടുവരുന്ന ആചാരങ്ങൾ സൃഷ്ടിക്കുക.",
        keywords: "home, hope, traditions",
    },
    {
        category: "family",
        title_en: "Family Time Without Phones",
        title_ml: "ഫോണില്ലാതെ കുടുംബ സമയം",
        excerpt_en: "One hour a day for real connection.",
        excerpt_ml: "യഥാർത്ഥ ബന്ധത്തിനായി ദിവസത്തിൽ ഒരു മണിക്കൂർ.",
        keywords: "family time, phones, connection",
    },
    {
        category: "family",
        title_en: "Helping Children Manage Fear",
        title_ml: "കുട്ടികളുടെ ഭയം നിയന്ത്രിക്കാൻ സഹായിക്കുക",
        excerpt_en: "Use reassurance, prayer, and simple steps.",
        excerpt_ml: "ആശ്വാസവും പ്രാർത്ഥനയും ലളിതമായ പടികളും.",
        keywords: "kids, fear, reassurance",
    },
    {
        category: "family",
        title_en: "Gratitude Practice for Families",
        title_ml: "കുടുംബങ്ങൾക്ക് നന്ദി ശീലം",
        excerpt_en: "A nightly gratitude list builds joy.",
        excerpt_ml: "രാത്രിയിലെ നന്ദി പട്ടിക സന്തോഷം വളർത്തും.",
        keywords: "gratitude, joy, family",
    },

    {
        category: "article",
        title_en: "Understanding Faith in Daily Life",
        title_ml: "ദൈനംദിന ജീവിതത്തിൽ വിശ്വാസം മനസിലാക്കുക",
        excerpt_en: "Faith isn’t only for Sundays—it's for every choice.",
        excerpt_ml: "വിശ്വാസം ഞായറാഴ്ചകൾക്കല്ല — ഓരോ തീരുമാനത്തിനുമാണ്.",
        keywords: "article, faith, daily life",
    },
    {
        category: "article",
        title_en: "Why Community Matters",
        title_ml: "സമൂഹം എന്തുകൊണ്ട് പ്രധാനമാണ്",
        excerpt_en: "Growth happens faster when you don’t walk alone.",
        excerpt_ml: "ഒറ്റയ്ക്ക് നടക്കാത്തപ്പോൾ വളർച്ച വേഗമേറുന്നു.",
        keywords: "community, support, growth",
    },
    {
        category: "article",
        title_en: "Purpose: Finding Your Calling",
        title_ml: "ലക്ഷ്യം: നിങ്ങളുടെ വിളി കണ്ടെത്തുക",
        excerpt_en: "Explore gifts, values, and what moves your heart.",
        excerpt_ml: "നിങ്ങളുടെ കഴിവുകളും മൂല്യങ്ങളും ഹൃദയം തൊടുന്നതും അന്വേഷിക്കുക.",
        keywords: "purpose, calling, gifts",
    },
    {
        category: "article",
        title_en: "Hope That Doesn’t Depend on Circumstances",
        title_ml: "പരിസ്ഥിതികളിൽ ആശ്രയിക്കാത്ത പ്രത്യാശ",
        excerpt_en: "Hope stays when it is rooted deeper than events.",
        excerpt_ml: "ഇവന്റുകളേക്കാൾ ആഴത്തിൽ വേരൂന്നിയാൽ പ്രത്യാശ നിലനിൽക്കും.",
        keywords: "hope, circumstances, faith",
    },
    {
        category: "article",
        title_en: "A Practical Guide to Prayer",
        title_ml: "പ്രാർത്ഥനയ്ക്ക് ഒരു പ്രായോഗിക മാർഗ്ഗദർശി",
        excerpt_en: "Simple structure: praise, thanks, ask, and listen.",
        excerpt_ml: "ലളിത ഘടന: സ്തുതി, നന്ദി, അപേക്ഷ, കേൾപ്പ്.",
        keywords: "prayer guide, practical, faith",
    },
    {
        category: "article",
        title_en: "Handling Stress With Wisdom",
        title_ml: "സമ്മർദ്ദം ജ്ഞാനത്തോടെ കൈകാര്യം ചെയ്യുക",
        excerpt_en: "Sleep, boundaries, prayer, and small routines help.",
        excerpt_ml: "നിദ്ര, അതിരുകൾ, പ്രാർത്ഥന, ചെറിയ ശീലങ്ങൾ സഹായിക്കും.",
        keywords: "stress, wisdom, routines",
    },

    {
        category: "editorial",
        title_en: "A Message to Our Readers",
        title_ml: "വായനക്കാർക്ക് ഒരു സന്ദേശം",
        excerpt_en: "We aim to share hope-filled stories that build faith.",
        excerpt_ml: "വിശ്വാസം വളർത്തുന്ന പ്രത്യാശ നിറഞ്ഞ കഥകൾ പങ്കിടുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം.",
        keywords: "editorial, message, readers",
    },
    {
        category: "editorial",
        title_en: "Choosing Kindness in a Noisy World",
        title_ml: "ശബ്ദമുള്ള ലോകത്ത് കരുണ തിരഞ്ഞെടുക്കുക",
        excerpt_en: "Kindness is strength, not weakness.",
        excerpt_ml: "കരുണ ദൗർബല്യം അല്ല — ശക്തിയാണ്.",
        keywords: "kindness, editorial, culture",
    },
    {
        category: "editorial",
        title_en: "Faith That Shows in Actions",
        title_ml: "പ്രവർത്തികളിൽ തെളിയുന്ന വിശ്വാസം",
        excerpt_en: "Small acts of love can shift an entire community.",
        excerpt_ml: "സ്നേഹത്തിന്റെ ചെറിയ പ്രവർത്തികൾ ഒരു സമൂഹം മുഴുവൻ മാറ്റാം.",
        keywords: "faith, actions, love",
    },

    {
        category: "interview",
        title_en: "Interview: A Leader on Serving With Purpose",
        title_ml: "അഭിമുഖം: ലക്ഷ്യത്തോടെ സേവിക്കുന്നതിനെക്കുറിച്ച് ഒരു നേതാവ്",
        excerpt_en: "We talk about leadership, humility, and building people.",
        excerpt_ml: "നേതൃത്വം, വിനയം, ആളുകളെ ഉയർത്തൽ എന്നിവയെക്കുറിച്ച് സംസാരിക്കുന്നു.",
        keywords: "interview, leadership, purpose",
    },
];

async function main() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const dbName = new URL(MONGO_URI).pathname.replace("/", "") || "goodnews";
    const db = client.db(dbName);

    const categoriesCol = db.collection("categories");
    const postsCol = db.collection("posts");
    const newsCol = db.collection("news");

    // get super admin or make a fallback ObjectId
    const adminUser = await db.collection("users").findOne({ role: "SUPER_ADMIN" });
    const authorId = adminUser ? adminUser._id : new ObjectId();

    // Clean DB
    await categoriesCol.deleteMany({});
    await postsCol.deleteMany({});
    await newsCol.deleteMany({});

    // Insert categories
    const catDocs = categories.map((c) => ({
        ...c,
        _id: new ObjectId(),
        createdAt: now(),
        updatedAt: now(),
    }));
    await categoriesCol.insertMany(catDocs);

    // Helper to lookup category ID by slug
    const catMap = {};
    for (const cat of catDocs) catMap[cat.slug] = cat._id;

    // Insert mapped posts -> news array
    const newsDocs = posts.map((p, idx) => {
        const slug = mkSlug(p.title_en) + '-' + idx;
        // Use valid picsum images, Unsplash source is deprecated and causes 403s/404s/empty redirects
        const heroImage = `https://picsum.photos/seed/${encodeURIComponent(p.keywords).replace(/%20/g, '') + idx}/800/600`;

        return {
            title: p.title_en,
            slug,
            subtitle: p.title_ml,
            categoryId: catMap[p.category] || catDocs[0]._id,
            authorId,
            heroImage,
            contentBlocks: [
                { id: "b1", type: "paragraph", data: { text: p.excerpt_en } },
                { id: "b2", type: "paragraph", data: { text: p.excerpt_ml } },
                { id: "b3", type: "paragraph", data: { text: "Sections: (1) Intro (2) Key points (3) Prayer/Takeaway (4) Closing." } }
            ],
            status: 'PUBLISHED',
            publishedAt: now(),
            scheduledAt: null,
            viewCount: Math.floor(50 + Math.random() * 900),
            seoTitle: p.title_en,
            seoDescription: p.excerpt_en,
            seoKeywords: p.keywords.split(",").map((t) => t.trim()),
            ogImage: heroImage,
            createdAt: now(),
            updatedAt: now(),
        };
    });

    await newsCol.insertMany(newsDocs);

    console.log("✅ Seed completed successfully!");
    console.log(`Included categories: ${catDocs.length}`);
    console.log(`Included news: ${newsDocs.length}`);
    await client.close();
}

main().catch(err => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});

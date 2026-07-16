/**
 * Avalon Personality Test - Application Logic
 * Implements Big Five (OCEAN) mapping to Avalon Archetypes using 5D Euclidean Distance.
 */

// ==========================================================================
// 1. Data Definitions (Questions & Character Profiles)
// ==========================================================================

const QUESTIONS = [
    // Dimension 1: Neuroticism (N) - 红脸急眼指数
    {
        id: 1,
        dimension: 'N',
        dimName: '红脸急眼指数',
        text: '决胜局，你是一个好人，却被两个明反派配合“泼脏水”全桌人质疑。你感到委屈、焦虑，心跳加速，甚至发言有些结巴。'
    },
    {
        id: 2,
        dimension: 'N',
        dimName: '红脸急眼指数',
        text: '当你拿到反派牌时，你在发言前和发言中会感到不易察觉的紧张（如眼神游移、下意识摸牌、害怕别人盯着自己）。'
    },
    {
        id: 3,
        dimension: 'N',
        dimName: '红脸急眼指数',
        text: '如果一个你一直力保的好人，反过来投票拒绝了你的车队并怀疑你，你会感到强烈的愤怒，甚至有些想放弃这局游戏。'
    },
    {
        id: 4,
        dimension: 'N',
        dimName: '红脸急眼指数',
        text: '游戏结束后，如果刚才经历了激烈的争论或被信任的人背叛，你需要较长的时间来平复心情，很难立刻笑呵呵地开启下一局。'
    },
    {
        id: 5,
        dimension: 'N',
        dimName: '红脸急眼指数',
        text: '当看到“湖中仙女（验人）”标记指向你，或者你需要当众宣布某个玩家的真实身份时，你会感到手心出汗、心跳加速，非常担心自己的表情管理出卖了阵营。'
    },
    // Dimension 2: Extraversion (E) - 麦霸控场欲望
    {
        id: 6,
        dimension: 'E',
        dimName: '麦霸控场欲望',
        text: '游戏第一轮发车（第一天），你总是倾向于主动跳出来分析局势，甚至故意给出有争议的派票方案来观察全场反应。'
    },
    {
        id: 7,
        dimension: 'E',
        dimName: '麦霸控场欲望',
        text: '如果你发现了一个致命的逻辑漏洞，你会立刻拍桌指出，用强势的语气带领好人冲锋，享受全场目光聚焦的时刻。'
    },
    {
        id: 8,
        dimension: 'E',
        dimName: '麦霸控场欲望',
        text: '在混乱的争吵中，当别人试图打断你的发言时，你会毫不犹豫地提高音量把话语权抢回来，绝不退缩。'
    },
    {
        id: 9,
        dimension: 'E',
        dimName: '麦霸控场欲望',
        text: '连玩三个小时《阿瓦隆》后，你觉得精神焕发、越聊越兴奋，而不是觉得“说太多话了，感到很心累”。'
    },
    {
        id: 10,
        dimension: 'E',
        dimName: '麦霸控场欲望',
        text: '你非常渴望抢到“车长”（发牌人）的角色，认为只有自己亲自排兵布阵、挑选车队人选，才能最有效地掌控整局游戏的发展方向。'
    },
    // Dimension 3: Conscientiousness (C) - 无情票型复盘机
    {
        id: 11,
        dimension: 'C',
        dimName: '无情票型复盘机',
        text: '到了第四天复盘时，你脑海里最先浮现并最依赖的是绝对理性的“硬数据”（某天谁投了赞成、谁在车上失败），而非发言状态。'
    },
    {
        id: 12,
        dimension: 'C',
        dimName: '无情票型复盘机',
        text: '你认为“湖中仙女（验人）”的传递必须严格按照收益最大化的逻辑进行，随意验人或看心情给仙女是不可原谅的乱玩行为。'
    },
    {
        id: 13,
        dimension: 'C',
        dimName: '无情票型复盘机',
        text: '如果你是梅林，你在天亮前就会在心里排练好一套完整的递话和伪装计划，并且在白天严格按计划执行，不易被别人打乱。'
    },
    {
        id: 14,
        dimension: 'C',
        dimName: '无情票型复盘机',
        text: '你能清晰且准确地复述出两轮之前，某一个具体车队的五张投票（谁同意谁反对），并在辩论中以此作为核心武器。'
    },
    {
        id: 15,
        dimension: 'C',
        dimName: '无情票型复盘机',
        text: '你极其反感“带情绪的直觉站队”，认为每一个同意或反对的投票都必须有明确的逻辑推导作为支撑，无法容忍“我觉得他是好人所以投他”这种说辞。'
    },
    // Dimension 4: Agreeableness (A) - 傻白甜不忍背刺感
    {
        id: 16,
        dimension: 'A',
        dimName: '傻白甜不忍背刺感',
        text: '为了阵营胜利，当你必须去欺骗或背刺一个现实中关系极好的朋友时，你会感到明显的内疚感，甚至发言时会稍微手下留情。'
    },
    {
        id: 17,
        dimension: 'A',
        dimName: '傻白甜不忍背刺感',
        text: '面对一个发言极其诚恳、声泪俱下向你求票的玩家，即使他的逻辑有小瑕疵，你也会倾向于相信他的“真情流露”。'
    },
    {
        id: 18,
        dimension: 'A',
        dimName: '傻白甜不忍背刺感',
        text: '即使你心里怀疑某个人是反派，但如果当面指出他会引发非常激烈的冲突，你有时会选择沉默，或用委婉的方式表达。'
    },
    {
        id: 19,
        dimension: 'A',
        dimName: '傻白甜不忍背刺感',
        text: '在没有任何信息的第一天，你更倾向于认为大家都是好人（带着善意去听发言），而不是预设满桌都是准备骗你的坏人。'
    },
    {
        id: 20,
        dimension: 'A',
        dimName: '傻白甜不忍背刺感',
        text: '在游戏争吵激烈、某位新手玩家被大家集火怀疑并显得十分尴尬时，即使你怀疑他确实是反派，你也会倾向于帮他解围或缓和气氛。'
    },
    // Dimension 5: Openness (O) - 戏精骚操作脑洞
    {
        id: 21,
        dimension: 'O',
        dimName: '戏精骚操作脑洞',
        text: '作为梅林，为了防备暗杀，你极其倾向于采用反常规打法（如故意投错票、装作暴民、假装派西维尔），在混沌中传递信息。'
    },
    {
        id: 22,
        dimension: 'O',
        dimName: '戏精骚操作脑洞',
        text: '遇到游戏中新发明的“骚操作”（比如好人悍跳反派来钓鱼执法），你觉得非常刺激并迫不及待想尝试，不反感它打乱逻辑。'
    },
    {
        id: 23,
        dimension: 'O',
        dimName: '戏精骚操作脑洞',
        text: '你经常会凭借第一直觉或某种“玄学”的灵光一闪，投出一张毫无数据支撑但事后证明极其关键的票。'
    },
    {
        id: 24,
        dimension: 'O',
        dimName: '戏精骚操作脑洞',
        text: '你不仅分析桌上的发言，还喜欢观察场外因素（如某人拿牌时的微表情、某两人的私下交情）来辅助你的推理。'
    },
    {
        id: 25,
        dimension: 'O',
        dimName: '戏精骚操作脑洞',
        text: '你认为《阿瓦隆》的核心乐趣不在于死板的票型逻辑，而在于人与人之间心理战的博弈。你经常尝试通过“假装自己是神职”或者“假装自己说漏嘴”来主动钓鱼。'
    }
];

// Constants for Z-score normalization (Population Norms)
const POPULATION_NORMS = {
    N: { mean: 20, stdDev: 8 },
    E: { mean: 28, stdDev: 10 },
    C: { mean: 35, stdDev: 7 },
    A: { mean: 18, stdDev: 9 },
    O: { mean: 25, stdDev: 10 }
};

const SIMILARITY_DIVIDER = 12; // Normalization distance scale factor

const CHARACTERS = [
    {
        id: 'mordred',
        name: '莫德雷德 (Mordred)',
        shortName: '莫德雷德',
        title: '深海的隐形帝王',
        camp: 'evil',
        campName: '邪恶阵营',
        zScores: { N: -1.0, E: 0.2, C: 1.8, A: -0.5, O: -0.8 },
        weights: { N: 1.5, E: 0.5, C: 2.0, A: 1.5, O: 1.0 },
        desc: '你是阿瓦隆中隐藏最深的黑暗帝王。即使在明晃晃的阳光下，你也宛如无声的影子。梅林看不透你的底牌，队友依仗你的沉稳。你的冷静和逻辑是邪恶阵营最坚固的盾牌。',
        details: '拥有极高的逻辑自洽能力与大局观，情绪稳定到令人战栗，发言温和适度不张扬，在静水深流中掌控战局。',
        blueprint: {
            N: '极度冷静。你没有任何情绪波动的红脸状态，即使在被高度怀疑时也能以最平稳的气息陈述逻辑，彻底规避微表情漏洞。',
            E: '适度发言。你不追求成为麦霸抢风头，也不像刺客般极度划水，你的发言频率和体量与普通大众无异，完美隐蔽在人群中。',
            C: '逻辑重炮。你对票型和场上局势的逻辑记忆与推导处于降维打击的水平，能轻易以好人视角盘出完美的正逻辑。',
            A: '冷酷底色。为了全局胜利，你能够不动声色地做出对局欺骗，外表温和实则铁石心肠，理智超越情感。',
            O: '沉稳求实。你抗拒过分花哨的混沌操作，倾向于通过稳健的递话和合理的伪装，以堂堂正正的逻辑击溃对手。'
        },
        advice: '“大音希声，大象无形”。梅林无法在天亮前看到你的身份，这是你最大的武器。不要急于跳出来带节奏，而是要扮演好人团队中那根最坚实的逻辑支柱，在关键轮次引导好人走向错误的判断，或者通过逻辑递话给队友提供掩护，用你的大局观为邪恶阵营奠定胜局。'
    },
    {
        id: 'morgana',
        name: '莫甘娜 (Morgana)',
        shortName: '莫甘娜',
        title: '深渊的节奏大师',
        camp: 'evil',
        campName: '邪恶阵营',
        zScores: { N: -1.5, E: 1.8, C: 0.8, A: -1.5, O: 1.5 },
        weights: { N: 1.5, E: 2.0, C: 1.0, A: 1.0, O: 1.0 },
        desc: '你是天生的“谎言艺术家”。你能用真假参半的逻辑建立信任帝国，再亲手将其摧毁。你的心脏是一台冰冷的机器，能在高压下完美运作。',
        details: '低情绪起伏、高掌控欲、不为情感所动、极度逻辑自洽，且战术诡谲多变。',
        blueprint: {
            N: '极度抗压。即使被全场集火盘问，你也能心跳不加速、面不改色，撒下弥天大谎而无生理波澜。',
            E: '掌控欲极强。你敢于在人群中发声，强势洗脑其他玩家，享受主导讨论节奏的快感。',
            A: '铁石心肠。为了胜利，你可以毫无心理负担地背刺极其信任你的好人或现实朋友，不会受到道德包袱的牵绊。',
            C: '逻辑自洽。你能严密记住自己的伪装逻辑和投票记录，确保说谎时不留破绽。',
            O: '战术灵活。你善于利用反常理的发言或投票倒钩，制造混乱局面。'
        },
        advice: '适度示弱，警惕“完美陷阱”。 你的逻辑往往太过完美、控场气场太强，在高阶局反而容易引起警觉（毕竟没视野的好人总会迷茫）。尝试在发言中刻意留下一点无伤大雅的瑕疵，或者假装对某一张票型感到困惑，这种“平民的挣扎感”会让你伪装得更加致命。'
    },
    {
        id: 'merlin',
        name: '梅林 (Merlin)',
        shortName: '梅林',
        title: '隐秘的全知灯塔',
        camp: 'good',
        campName: '善良阵营',
        zScores: { N: 0.0, E: -1.5, C: 2.0, A: 1.0, O: 1.8 },
        weights: { N: 0.5, E: 2.0, C: 2.0, A: 1.0, O: 1.5 },
        desc: '你的大脑是一台超级计算机。你看得透所有的套路，记得住所有的选票，但深知“木秀于林风必摧之”，选择在暗中指引光明。',
        details: '高精度的记忆与严密的逻辑（高C），同时拥有大局观（高O）。情绪上谨慎克制（中低N），发言极度隐蔽（极低E）。',
        blueprint: {
            N: '平稳心态。在刺客暗杀的巨大压力下，你能维持相对冷静的状态，不因手持特殊视野而举止失措。',
            E: '克制发言。你极力隐藏锋芒，绝不主动站上讨论焦点，而是隐蔽在发言队列后方，用微弱却关键的信息引导队友。',
            C: '算无遗策。你是场上的绝对理性源泉，对每一个车队及票型的演算无懈可击，拥有完美的逻辑闭环。',
            A: '心系好人。你在博弈中时刻保持关怀善良阵营的立场，但绝不让感性蒙蔽双眼，理性推导演算大于一切。',
            O: '全知视角。你能瞬间识破邪恶阵营反常规的“骚操作”和倒钩打法，具有开天眼般的信息整合能力。'
        },
        advice: '寻找你的“大喇叭”。 你最大的弱点是信息很难有效转化为选票（因为不敢大声说）。尽早识别场上那些“高外向性”的好人平民（亚瑟的忠臣），在私下或用温和的语气把你的逻辑推演“喂”给他们。让他们去前台大声冲锋，你做隐秘的大脑，既保证了阵营胜利，又规避了暗杀风险。'
    },
    {
        id: 'percival',
        name: '派西维尔 (Percival)',
        shortName: '派西维尔',
        title: '焦虑的忠诚守卫',
        camp: 'good',
        campName: '善良阵营',
        zScores: { N: 2.0, E: -0.5, C: 0.5, A: 1.5, O: -1.2 },
        weights: { N: 2.0, E: 0.5, C: 1.0, A: 1.5, O: 1.0 },
        desc: '你是全场活得最“累”的关键人物。责任感与迷茫交织，你极其真实的“纠结感”，往往是你赢得好人信任的最强武器。',
        details: '高敏感易焦虑（高N），渴望建立人际信任（高A），用尽全力去推理记票（高C），抗拒过于跳跃的骚操作（低O）。',
        blueprint: {
            N: '极度敏感。拿到带特殊视野或重任的牌时，你会感到巨大的压力 and 焦虑，非常害怕自己站错队导致团队输掉。',
            E: '选择性发声。你不会一上来就带节奏，但当你确信找到了梅林或锁定了反派时，你会站出来大声疾呼。',
            C: '努力推理。你极其渴望用硬数据和投票逻辑来辅助自己做判断，哪怕过程会很痛苦。',
            A: '渴望信任。你本能地在人群中寻找值得信赖的领袖（找梅林），同时也很容易被声情并茂的伪装者（莫甘娜）欺骗。',
            O: '求稳心态。你讨厌过于混乱的战术，希望大家都能按部就班、坦诚相待地推理。'
        },
        advice: '锚定冰冷数据，切断感性共情。 当你陷入谁是真梅林、谁是莫甘娜的极度纠结时，你的共情能力会成为毒药。强迫自己闭上眼睛不看对方委屈的表情，只回想冷冰冰的“数据”：第二局决定性发车时，他到底投了同意还是反对？谁的票型收益最高？让数据代替你的直觉做决定。'
    },
    {
        id: 'assassin',
        name: '刺客 (Assassin)',
        shortName: '刺客',
        title: '潜伏的冷酷狙击手',
        camp: 'evil',
        campName: '邪恶阵营',
        zScores: { N: -1.0, E: -2.0, C: 1.0, A: -1.8, O: -1.0 },
        weights: { N: 1.0, E: 2.0, C: 1.0, A: 1.5, O: 0.5 },
        desc: '你是社交桌游中的“孤狼”。你不需要情感共鸣，也不喜欢长篇大论。你就像监控探头，冷冷审视破绽，只为最终的致命一击。',
        details: '免疫情感操控，怀疑一切（极低A），在角落冷眼旁观不爱争抢（低E），专注搜集硬逻辑破绽以精准刺杀（高C），心态沉稳坚硬（低N）。',
        blueprint: {
            N: '冰冷镇定。即使游戏处于劣势，你也不会暴躁，而是默默计算最后的刺杀概率。',
            E: '极致边缘。你总是坐在角落，发言极其精简甚至故意划水，绝不主动吸引全场的火力。',
            C: '细节捕手。你在暗中死死盯着每一张票和每一个发言的动机，专门捕捉那些掌握过多信息量、试图递话的神职（寻找梅林）。',
            A: '怀疑一切。你极其缺乏盲目信任，天生对其他玩家的话语抱有敌意和审视，完全免情感操控。',
            O: '目标导向。你的思维聚焦于最终目标，对无关紧要的杂讯和“骚操作”不感兴趣。'
        },
        advice: '增加伪装的“温度”。 你往往过于精简、冷酷，像个没有感情的杀手，这在前期极易被当成无贡献 of 划水牌抗推掉。如果你活不到最后，就无法执行暗杀。强迫自己在前几轮说几句废话，适度模仿平民的焦虑感表达一下“我也很想找出坏人赢游戏”，用“温度”保全自己的生存空间。'
    },
    {
        id: 'oberon',
        name: '奥伯伦 (Oberon)',
        shortName: '奥伯伦',
        title: '自由的混沌制造者',
        camp: 'evil',
        campName: '邪恶阵营',
        zScores: { N: 1.2, E: 1.5, C: -2.5, A: -0.8, O: 2.5 },
        weights: { N: 0.5, E: 1.0, C: 2.0, A: 0.5, O: 2.0 },
        desc: '你是让所有人（包括队友）头疼的“X因素”。讨厌枯燥的盘逻辑，你的一次“乱玩”，常常能乱拳打死老师傅，击碎算计的逻辑闭环。',
        details: '极高的战术灵活性与直觉依赖（极高O），讨厌记票与繁杂复盘（低C），情绪和发言状态飘忽（高N），发言大声高调（高E）。',
        blueprint: {
            N: '状态飘忽。你的情绪极不稳定，可能上一局还在为被抗推而愤怒，下一局就笑嘻嘻地胡乱投票。',
            E: '大声宣告。你不仅想法清奇，还喜欢大声向全桌宣告你的神奇逻辑，享受别人对你感到无奈的目光。',
            C: '随心所欲。你最讨厌记票型和复盘硬数据，认为“记票太累了，游戏凭感觉玩就好”，做事缺乏规划。',
            A: '我行我素。你不太在乎自己的行为是否会给团队带来困扰，游戏的乐趣优先于阵营的胜利。',
            O: '思维跳跃。你极其热衷于打破常规，凭直觉、玄学或者纯粹为了好玩而投出离奇的选票，是天生的“乐子人”。'
        },
        advice: '让“混沌”带有战术目的。 你天马行空的乱玩确实能打破常规，但也极容易让队友崩溃。试着控制你制造混乱的频率，把你的不可预测性当成一种武器，而不是本能。比如，你可以故意用离奇的发言去试探某个人底线（看他是否急着踩你），或者在关键轮次收起玩心回归逻辑，打对手一个措手不及。'
    },
    {
        id: 'loyal_servant',
        name: '亚瑟的忠臣 (Loyal Servant)',
        shortName: '忠臣',
        title: '率真的直觉平民',
        camp: 'good',
        campName: '善良阵营',
        zScores: { N: 1.5, E: 1.0, C: -1.5, A: 1.2, O: -0.5 },
        weights: { N: 1.5, E: 1.0, C: 1.5, A: 1.0, O: 0.5 },
        desc: '你是游戏社交氛围的基石。情绪外露，正义感十足。你是一把易折但极其锋利的剑，极其需要一个聪明的领袖来指引方向。',
        details: '大声疾呼、勇敢冲锋（高E），极其情绪化、受不得委屈（高N），非常容易轻信诚恳的发言（高A），喜欢通过微表情状态而不是硬票型来判断（低C）。',
        blueprint: {
            N: '正义感爆棚。你极其讨厌被冤枉，一旦受到不公正的指责，你的情绪会立刻被点燃，产生强烈的愤怒和反击。',
            E: '大声疾呼。你拿到好人牌时底气十足，敢于冲锋阵营，在讨论中声音最洪亮。',
            C: '凭状态断案。比起复杂的逻辑推导，你更容易记住对方发言时的表情和态度，“谁看起来像好人我就投给谁”。',
            A: '极易共情。你非常容易轻信那些“面善”或发言诚恳的玩家，容易被人带节奏当枪使。',
            O: '随大流。你本身不创造新战术，但如果大家都在尝试，你也会愿意跟进。'
        },
        advice: '延迟满足，防守反击。 你极强的正义感和充沛的表达欲，往往会让你成为反派“借刀杀人”的最佳工具。当你在场上被激怒，或者对某人产生强烈的信任/怀疑时，先在心里倒数 5 秒钟再开口。学会跟在逻辑严密的玩家身后投票，不要做第一个抛出绝对判断的人，让子弹飞一会儿。'
    }
];

const DIMENSION_TEXTS = {
    N: {
        title: '神经质 / 情绪稳定性 (N)',
        high: '高分：情绪起伏明显，对被质疑、背叛的压力反应强烈，发言容易因情绪激动而展现“真情流露”。',
        med: '中分：有一定的抗压能力，但在极高压局势或关键决胜局下，内心仍会感到明显的波动与焦虑。',
        low: '低分：极强的心理韧性与静气，拿到坏人牌毫无生理波动，在全场质疑中仍能镇定发言，堪称大心脏。'
    },
    E: {
        title: '外向性 / 话语权掌控 (E)',
        high: '高分：强烈的表达欲与焦点渴望，主动发起分析，通过声音分贝或强势逻辑在混乱中拿稳发言权。',
        med: '中分：发言分寸感较好，该站出来时会表达，但不刻意追求全场视线焦点，能倾听也能输出。',
        low: '低分：隐藏锋芒，倾向于冷眼旁观，不爱打断别人或大声争执，常通过低调的关键一票传递立场。'
    },
    C: {
        title: '尽责性 / 信息处理严谨度 (C)',
        high: '高分：严谨的“逻辑铁人”，极其依赖车队投票历史和绝对的硬数据，追求战术最优解，眼里容不下乱玩。',
        med: '中分：重视逻辑，但也能灵活应对，不会完全死抠每张票的绝对死逻辑，允许一定的直觉判断。',
        low: '低分：凭第一感觉或状态抓人，嫌记录票型太累，信奉“玩游戏凭感觉”，随性自由。'
    },
    A: {
        title: '宜人性 / 信任与共情 (A)',
        high: '高分：真诚且渴望信任，容易受到声泪俱下的情绪发言影响，欺骗现实好友时会有强烈的负罪感。',
        med: '中分：具备基础共情心，但在博弈游戏中能保持基本的防线，在情感状态与票型逻辑间寻找平衡。',
        low: '低分：怀疑一切的冷酷狙击手，天然免疫真情流露的表演，背刺和伪装毫无心理压力，目标至上。'
    },
    O: {
        title: '开放性 / 策略灵活性 (O)',
        high: '高分：思维跳跃，乐于尝鲜骚操作与倒钩打法，擅长盘“场外信息”（微表情、关系度），善用直觉。',
        med: '中分：对新战术有包容心，但在实际局中仍以传统正逻辑打法为主，以确保稳妥。',
        low: '低分：传统理性打法，主张稳健推导，抗拒过分花哨的欺骗或自乱阵脚的战术，渴望透明正统的逻辑。'
    }
};

// ==========================================================================
// 2. Application State Management
// ==========================================================================

let appState = {
    currentQuestionIndex: 0,
    answers: Array(QUESTIONS.length).fill(null) // Initialize to null to enforce active answering
};

// ==========================================================================
// 3. Dom Elements Cache
// ==========================================================================

const DOM = {
    // Screens
    welcomeScreen: document.getElementById('welcome-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    loadingScreen: document.getElementById('loading-screen'),
    resultsScreen: document.getElementById('results-screen'),
    
    // Welcome Controls
    startBtn: document.getElementById('start-btn'),
    
    // Quiz Controls
    questionIndex: document.getElementById('question-index'),
    progressFill: document.getElementById('progress-fill'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    
    // Results Elements
    campBanner: document.getElementById('camp-banner'),
    campText: document.getElementById('camp-text'),
    characterName: document.getElementById('character-name'),
    characterTitle: document.getElementById('character-title'),
    characterDesc: document.getElementById('character-desc'),
    characterImg: document.getElementById('character-img'),
    radarChartTarget: document.getElementById('radar-chart-target'),
    dimensionsList: document.getElementById('dimensions-list'),
    shareBtn: document.getElementById('share-btn'),
    restartBtn: document.getElementById('restart-btn'),
    toast: document.getElementById('toast'),

    // Share Poster Elements
    shareModal: document.getElementById('share-modal'),
    closeShareBtn: document.getElementById('close-share-btn'),
    downloadPosterBtn: document.getElementById('download-poster-btn'),
    sharePosterImg: document.getElementById('share-poster-img'),
    posterCharacterImg: document.getElementById('poster-character-img'),
    posterLoadingSpinner: document.getElementById('poster-loading-spinner')
};

// ==========================================================================
// 4. State & Screen Transition Utilities
// ==========================================================================

function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('fade-in');
    setTimeout(() => {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        // Force reflow
        toScreen.offsetHeight;
        toScreen.classList.add('fade-in');
    }, 250);
}

// Initialize Application
function init() {
    // Event listener for welcome start
    DOM.startBtn.addEventListener('click', () => {
        switchScreen(DOM.welcomeScreen, DOM.quizScreen);
        renderQuestion();
    });

    // Options selection
    DOM.optionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.option-btn');
        if (!btn) return;
        
        const val = parseFloat(btn.dataset.value);
        appState.answers[appState.currentQuestionIndex] = val;
        
        // Highlight selection
        const allBtns = DOM.optionsContainer.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        // Enable next button since an answer has been selected
        DOM.nextBtn.disabled = false;
    });

    // Navigation Controls
    DOM.prevBtn.addEventListener('click', handlePrevious);
    DOM.nextBtn.addEventListener('click', handleNext);
    DOM.restartBtn.addEventListener('click', handleRestart);
    DOM.shareBtn.addEventListener('click', handleShare);

    // Modal Close handlers
    DOM.closeShareBtn.addEventListener('click', () => {
        DOM.shareModal.classList.remove('active');
    });
    DOM.shareModal.addEventListener('click', (e) => {
        if (e.target === DOM.shareModal) {
            DOM.shareModal.classList.remove('active');
        }
    });
}

// ==========================================================================
// 5. Quiz Screen Operations
// ==========================================================================

function renderQuestion() {
    const question = QUESTIONS[appState.currentQuestionIndex];
    
    // Update progress numbers
    const totalQ = QUESTIONS.length;
    const progressNum = String(appState.currentQuestionIndex + 1).padStart(2, '0');
    DOM.questionIndex.textContent = `${progressNum} / ${totalQ}`;
    
    // Update progress bar width
    const percentage = ((appState.currentQuestionIndex + 1) / totalQ) * 100;
    DOM.progressFill.style.width = `${percentage}%`;
    
    // Transition text cleanly
    const quizCard = document.getElementById('quiz-card');
    
    // Apply slide-in animation to card
    quizCard.classList.remove('slide-in-left', 'slide-in-right');
    // Read offset to trigger browser repaint
    quizCard.offsetWidth;
    
    DOM.questionText.textContent = question.text;
    
    // Restore saved value and highlight matching option button
    const savedVal = appState.answers[appState.currentQuestionIndex];
    const allBtns = DOM.optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(btn => {
        const val = parseFloat(btn.dataset.value);
        if (savedVal !== null && val === savedVal) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Manage disabled states
    DOM.prevBtn.disabled = (appState.currentQuestionIndex === 0);
    DOM.nextBtn.disabled = (savedVal === null);
    
    if (appState.currentQuestionIndex === totalQ - 1) {
        DOM.nextBtn.querySelector('span').textContent = '查看结果';
        DOM.nextBtn.querySelector('svg').innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        `;
    } else {
        DOM.nextBtn.querySelector('span').textContent = '下一题';
        DOM.nextBtn.querySelector('svg').innerHTML = `
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        `;
    }
}

function handlePrevious() {
    if (appState.currentQuestionIndex > 0) {
        const quizCard = document.getElementById('quiz-card');
        quizCard.classList.add('slide-out-right');
        
        setTimeout(() => {
            appState.currentQuestionIndex--;
            quizCard.classList.remove('slide-out-right');
            renderQuestion();
            quizCard.classList.add('slide-in-left');
        }, 150);
    }
}

function handleNext() {
    const totalQ = QUESTIONS.length;
    const quizCard = document.getElementById('quiz-card');
    
    if (appState.currentQuestionIndex < totalQ - 1) {
        quizCard.classList.add('slide-out-left');
        
        setTimeout(() => {
            appState.currentQuestionIndex++;
            quizCard.classList.remove('slide-out-left');
            renderQuestion();
            quizCard.classList.add('slide-in-right');
        }, 150);
    } else {
        // We reached the end, show loading screen then calculations
        switchScreen(DOM.quizScreen, DOM.loadingScreen);
        
        setTimeout(() => {
            calculateAndDisplayResults();
        }, 1600); // 1.6s of thematic suspenseful loading
    }
}

// ==========================================================================
// 6. Personality Calculations (5D Euclidean Space Matching)
// ==========================================================================

function calculateAndDisplayResults() {
    // Step 1: Calculate aggregate scores for each dimension (O, C, E, A, N)
    const rawScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    
    QUESTIONS.forEach((q, idx) => {
        rawScores[q.dimension] += appState.answers[idx];
    });
    
    // Step 2: Normalize raw scores to standard Z-scores based on population norms
    const userZScores = {};
    for (const dim in POPULATION_NORMS) {
        const norm = POPULATION_NORMS[dim];
        userZScores[dim] = (rawScores[dim] - norm.mean) / norm.stdDev;
    }
    
    // Step 3: Compute Weighted Euclidean Distance for each of the characters
    const matches = CHARACTERS.map(char => {
        let weightedSquaredDiffSum = 0;
        
        for (const dim in POPULATION_NORMS) {
            const zUser = userZScores[dim];
            const zChar = char.zScores[dim];
            const weight = char.weights[dim];
            weightedSquaredDiffSum += weight * Math.pow(zUser - zChar, 2);
        }
        
        const dist = Math.sqrt(weightedSquaredDiffSum);
        
        // Convert to compatibility percentage using the normalized scale factor
        const similarity = Math.max(0, Math.min(100, Math.round(100 * (1 - dist / SIMILARITY_DIVIDER))));
        
        return {
            ...char,
            distance: dist,
            similarity: similarity
        };
    });
    
    // Step 4: Sort by highest similarity
    matches.sort((a, b) => b.similarity - a.similarity);
    
    const primaryMatch = matches[0];
    
    // Display results
    renderResults(primaryMatch, matches, rawScores);
    
    // Switch Screen
    switchScreen(DOM.loadingScreen, DOM.resultsScreen);
}

// ==========================================================================
// 7. Results Screen Render Utilities
// ==========================================================================

function renderResults(primary, allMatches, userScores) {
    // 1. Render primary character details
    DOM.characterName.textContent = primary.shortName;
    DOM.characterTitle.textContent = primary.title;
    DOM.characterDesc.textContent = primary.desc;
    
    // Set character illustrations
    const imagePath = `images/avalon_${primary.id}.png`;
    DOM.characterImg.src = imagePath;
    DOM.posterCharacterImg.src = imagePath;
    
    // Set Camp classes and text
    DOM.campBanner.className = `camp-banner ${primary.camp}`;
    DOM.campText.textContent = primary.campName;
    
    // Set placeholder art theme coloring dynamically based on alignment
    const artContainer = document.querySelector('.image-placeholder-art');
    if (primary.camp === 'good') {
        artContainer.style.borderColor = 'rgba(59, 130, 246, 0.3)';
        artContainer.style.color = 'var(--color-good)';
    } else {
        artContainer.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        artContainer.style.color = 'var(--color-evil)';
    }

    // Render Archetype Advice
    const adviceText = document.getElementById('character-advice');
    adviceText.textContent = primary.advice;

    // 2. Render dynamic Radar Chart SVG
    renderRadarChart(userScores);

    // 3. Render detailed Dimension Breakdown (integrated with archetype blueprints)
    renderDimensionList(userScores, primary);

    // 4. Render Character Compatibility Rankings
    renderCompatibilityList(allMatches);
}

// Render dynamic inline SVG Radar Chart
function renderRadarChart(scores) {
    const dimensions = ['N', 'E', 'C', 'A', 'O'];
    const labels = ['红脸急眼指数 (N)', '麦霸控场欲望 (E)', '无情票型复盘机 (C)', '傻白甜不忍背刺感 (A)', '戏精骚操作脑洞 (O)'];
    
    const size = 320;
    const center = size / 2;
    const maxRadius = 110;
    const angleStep = (Math.PI * 2) / dimensions.length; // 72 degrees in rad
    
    let svgContent = `<svg class="radar-svg" viewBox="0 0 ${size} ${size}">`;
    
    // Definition for glowing gradient
    svgContent += `
        <defs>
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="var(--color-gold)" stop-opacity="0.3" />
                <stop offset="100%" stop-color="var(--color-gold)" stop-opacity="0.0" />
            </radialGradient>
        </defs>
    `;

    // A. Draw Grid Lines (Concentric pentagons representing scores 10, 20, 30, 40, 50)
    const gridTicks = [10, 20, 30, 40, 50];
    gridTicks.forEach(tick => {
        const radius = (tick / 50) * maxRadius;
        let points = [];
        for (let i = 0; i < dimensions.length; i++) {
            const angle = i * angleStep - Math.PI / 2; // Offset by -90 deg to start top
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        svgContent += `<polygon points="${points.join(' ')}" class="radar-grid-line" fill="none" />`;
    });

    // B. Draw Axis Lines & Text Labels
    for (let i = 0; i < dimensions.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        
        // Axis lines
        const endX = center + maxRadius * Math.cos(angle);
        const endY = center + maxRadius * Math.sin(angle);
        svgContent += `<line x1="${center}" y1="${center}" x2="${endX}" y2="${endY}" class="radar-axis-line" />`;
        
        // Label position (dynamic text-anchor to prevent overflow cutting)
        const cosVal = Math.cos(angle);
        let anchor = 'middle';
        let labelRadius = maxRadius + 15; // default label radius
        
        if (cosVal > 0.3) {
            anchor = 'start';
            labelRadius = maxRadius + 10; // push closer to center to fit text boundary
        } else if (cosVal < -0.3) {
            anchor = 'end';
            labelRadius = maxRadius + 10; // push closer to center to fit text boundary
        } else {
            anchor = 'middle';
            labelRadius = maxRadius + 18;
        }

        const lblX = center + labelRadius * cosVal;
        let lblY = center + labelRadius * Math.sin(angle);
        if (i === 2 || i === 3) lblY += 8; // Bottom labels offset
        if (i === 0) lblY -= 12; // Top label offset
        
        svgContent += `<text x="${lblX}" y="${lblY}" text-anchor="${anchor}" class="radar-label">${labels[i]}</text>`;
    }

    // C. Draw User Data Polygon
    let userPoints = [];
    for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        const userScore = scores[dim];
        const radius = (userScore / 50) * maxRadius;
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        userPoints.push(`${x},${y}`);
    }
    
    svgContent += `<polygon points="${userPoints.join(' ')}" class="radar-polygon-user" />`;
    
    // D. Draw Data Dots
    for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        const userScore = scores[dim];
        const radius = (userScore / 50) * maxRadius;
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        
        svgContent += `<circle cx="${x}" cy="${y}" r="4" class="radar-dot-user" />`;
    }
    
    svgContent += `</svg>`;
    DOM.radarChartTarget.innerHTML = svgContent;
}

// Render Dimension List Detail Cards
function renderDimensionList(scores, primary) {
    DOM.dimensionsList.innerHTML = '';
    
    const dimensions = ['N', 'E', 'C', 'A', 'O'];
    
    dimensions.forEach(dim => {
        const score = scores[dim];
        const textKey = score > 31 ? 'high' : (score >= 19 ? 'med' : 'low');
        const descText = DIMENSION_TEXTS[dim][textKey];
        const percentage = (score / 50) * 100;
        
        // Match archetype blueprint text for this dimension
        const blueprintDesc = primary.blueprint[dim];
        const blueprintHtml = blueprintDesc 
            ? `
            <div class="dim-blueprint">
                <span class="blueprint-tag">${primary.shortName}原型特质</span>
                <p class="blueprint-text">${blueprintDesc}</p>
            </div>
            `
            : '';
        
        const dimItem = document.createElement('div');
        dimItem.className = 'dimension-item';
        dimItem.innerHTML = `
            <div class="dim-info-header">
                <span class="dim-name">${DIMENSION_TEXTS[dim].title}</span>
                <span class="dim-score">${score} / 50分</span>
            </div>
            <div class="dim-bar-track">
                <div class="dim-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <p class="dim-summary-text">${descText}</p>
            ${blueprintHtml}
        `;
        DOM.dimensionsList.appendChild(dimItem);
    });
}

// Render Character Compatibility Rankings Card
function renderCompatibilityList(allMatches) {
    const compatList = document.getElementById('compat-list');
    if (!compatList) return;
    
    compatList.innerHTML = '';
    
    allMatches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'compat-item';
        
        // Color matching alignment
        const barColor = match.camp === 'good' ? 'var(--color-good)' : 'var(--color-evil)';
        
        item.innerHTML = `
            <span class="compat-name">${match.shortName}</span>
            <div class="compat-bar-track">
                <div class="compat-bar-fill" style="width: ${match.similarity}%; background-color: ${barColor};"></div>
            </div>
            <span class="compat-percentage">${match.similarity}%</span>
        `;
        compatList.appendChild(item);
    });
}


// ==========================================================================
// 8. Bottom Page Action Handling
// ==========================================================================

function handleRestart() {
    appState.currentQuestionIndex = 0;
    appState.answers = Array(QUESTIONS.length).fill(null); // Reset to null to enforce active answering
    
    switchScreen(DOM.resultsScreen, DOM.welcomeScreen);
}

function handleShare() {
    // Generate simple share content
    const matchedRole = DOM.characterName.textContent;
    const title = DOM.characterTitle.textContent;
    
    // Show Modal and Loading
    DOM.shareModal.classList.add('active');
    DOM.posterLoadingSpinner.classList.add('active');
    DOM.sharePosterImg.style.display = 'none';

    // Populate off-screen poster with actual matched details
    const posterCampBanner = document.getElementById('poster-camp-banner');
    const posterCampText = document.getElementById('poster-camp-text');
    const posterCharName = document.getElementById('poster-character-name');
    const posterCharTitle = document.getElementById('poster-character-title');
    const posterCharDesc = document.getElementById('poster-character-desc');
    
    posterCampBanner.className = DOM.campBanner.className;
    posterCampText.textContent = DOM.campText.textContent;
    posterCharName.textContent = DOM.characterName.textContent;
    posterCharTitle.textContent = DOM.characterTitle.textContent;
    posterCharDesc.textContent = DOM.characterDesc.textContent;
    
    // Copy high-level advice
    const posterCharAdvice = document.getElementById('poster-character-advice');
    posterCharAdvice.textContent = document.getElementById('character-advice').textContent;
    
    // Copy the Radar Chart SVG
    const radarSVG = DOM.radarChartTarget.innerHTML;
    const posterRadarTarget = document.getElementById('poster-radar-chart-target');
    posterRadarTarget.innerHTML = radarSVG;
    
    // Set poster styling colors based on alignment
    const sharePoster = document.getElementById('share-poster-template');
    if (DOM.campBanner.classList.contains('good')) {
        sharePoster.classList.remove('evil-theme');
        sharePoster.classList.add('good-theme');
    } else {
        sharePoster.classList.remove('good-theme');
        sharePoster.classList.add('evil-theme');
    }

    // Capture off-screen poster card
    const generateCanvas = () => {
        html2canvas(sharePoster, {
            scale: 2, // 2x scale for crisp mobile display
            useCORS: true,
            backgroundColor: '#0c0f1a' // Match background
        }).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png');
            DOM.sharePosterImg.src = dataUrl;
            DOM.sharePosterImg.style.display = 'block';
            DOM.posterLoadingSpinner.classList.remove('active');
            
            // Setup download button
            DOM.downloadPosterBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = `Avalon_Personality_${matchedRole}.png`;
                link.href = dataUrl;
                link.click();
            };
        }).catch(err => {
            console.error('Error generating poster:', err);
            DOM.posterLoadingSpinner.classList.remove('active');
            // Fallback: Copy share text
            fallbackShareText(matchedRole, title);
        });
    };

    // Ensure custom web fonts are fully loaded before rendering the canvas
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(generateCanvas);
    } else {
        setTimeout(generateCanvas, 400);
    }
}

function fallbackShareText(role, title) {
    DOM.shareModal.classList.remove('active');
    const url = window.location.href;
    const shareText = `我在阿瓦隆博弈戏精指数测试中测出我的博弈原型是【${role} - ${title}】！快来测测你扮演哪个角色吧：${url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(showToast).catch(err => {
            fallbackCopy(shareText);
        });
    } else {
        fallbackCopy(shareText);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

function showToast() {
    DOM.toast.classList.add('show');
    setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 2500);
}

// ==========================================================================
// 9. Boot up Initialization
// ==========================================================================

window.addEventListener('DOMContentLoaded', init);

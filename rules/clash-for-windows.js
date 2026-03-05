/**
 * DNS
 */
const defaultNameserver = ['119.29.29.29', '223.5.5.5']
// 国内DNS服务器
const cnDNS = [
  'https://doh.pub/dns-query', // 腾讯
  'https://dns.alidns.com/dns-query' // 阿里
]
// 国外DNS服务器
const foreignDNS = [
  'tls://8.8.8.8', // google
  'tls://1.1.1.1', // Cloudflare
  'tls://9.9.9.9' // Quad9
]
// DNS配置
const dnsConfig = {
  enable: true,
  listen: '0.0.0.0:53',
  ipv6: false,

  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.1/16',

  // fake ip 过滤：此列表中的主机名将不会使用 Fake IP 解析，即对这些域名的请求将始终使用其真实 IP 地址进行响应
  'fake-ip-filter': [
    '*.lan',
    '*.local',
    // Windows网络出现小地球图标
    '+.msftconnecttest.com',
    '+.msftncsi.com',
    'localhost.ptlogin2.qq.com',
    'localhost.sec.qq.com',
    'localhost.work.weixin.qq.com'
  ],

  // 是否回应配置中的 hosts
  'use-hosts': true,

  // 默认域名服务器：用于解析 DNS 服务器 的域名，必须为 IP
  'default-nameserver': defaultNameserver,

  // 域名服务器
  nameserver: cnDNS,

  // 后备域名解析服务器：一般情况下使用境外 DNS。与nameserver并发查询，将结果匹配 fallback-filter
  fallback: foreignDNS,
  // 后备域名解析服务器过滤
  'fallback-filter': {
    geoip: true,
    // 除了 geoip-code 配置的国家 IP, 其他的 IP 结果会被视为污染
    'geoip-code': 'CN',
    // 网段的结果会被视为污染
    ipcidr: ['240.0.0.0/4', '0.0.0.0/32']
  }
}

/**
 * 分组
 */
const areaGroupRegs = {
  '🇭🇰 香港节点': { reg: /^(?!.*游戏).*(香港|🇭🇰|HongKong|HK)+(.*)$/i },
  '🇨🇳 台湾节点': { reg: /^(?!.*游戏).*(台湾|🇨🇳|Taiwan|TW)+(.*)$/i },
  '🇯🇵 日本节点': { reg: /^(?!.*游戏).*(日本|🇯🇵|Japan|JP|东京)+(.*)$/i },
  '🇸🇬 新加坡节点': { reg: /^(?!.*游戏).*(新加坡|🇸🇬|Singapore|SG|狮城)+(.*)$/i },
  '🇰🇷 韩国节点': { reg: /^(?!.*游戏).*(韩国|🇰🇷|Korea|Kr)+(.*)/i },
  '🇺🇲 美国节点': { reg: /^(?!.*游戏).*(美国|🇺🇸|American|US)+(.*)$/i },
  '🏳️‍🌈 其他地区': { reg: /^(?!.*游戏).*/ }
}
const customGroupRegs = {
  '⬇️ 低倍节点': { reg: /(?<![0-9])0\.[0-9]+|低倍/ },
  '💬 人工智能': { reg: /^(?!.*游戏).*(ai|gpt)+(.*)/i }
}
const proxiesFilter = (
  proxies,
  scheme,
  options = { skip: true, target: 'array' }
) => {
  let proxyGroups = Object.entries(scheme).map(([name, item]) => {
    return {
      name,
      regExp: item.reg,
      type: item.type || 'url-test',
      url: 'http://cp.cloudflare.com/generate_204',
      // url: 'http://www.gstatic.com/generate_204',
      interval: 300,
      tolerance: 50,
      proxies: []
    }
  })

  proxies.forEach(proxy => {
    for (let item of proxyGroups) {
      if (item.regExp.test(proxy.name)) {
        item.proxies.push(proxy.name)
        if (options.skip) break
      }
    }
  })

  proxyGroups = proxyGroups.filter(item => {
    delete item.regExp
    return item.proxies.length > 0
  })

  return options.target === 'array'
    ? proxyGroups
    : proxyGroups.reduce((res, item) => {
        res[item.name] = item
        return res
      }, {})
}
const proxyGroupsGenerator = proxies => {
  const areaProxyGroup = proxiesFilter(proxies, areaGroupRegs)
  const customProxyGroup = proxiesFilter(proxies, customGroupRegs, {
    skip: false,
    target: 'object'
  })
  const areaProxyGroupName = areaProxyGroup.map(item => item.name)

  return [
    {
      name: '🚀 节点选择',
      type: 'select',
      proxies: [
        '🗺 地区节点',
        '⬇️ 低倍节点',
        ...proxies.map(item => item.name),
        'DIRECT'
      ]
    },
    {
      name: '🗺 地区节点',
      type: 'select',
      proxies: areaProxyGroupName
    },
    {
      name: '⬇️ 低倍节点',
      type: 'select',
      proxies: ['DIRECT', ...(customProxyGroup['⬇️ 低倍节点']?.proxies || [])]
    },
    {
      name: '💬 人工智能',
      type: 'select',
      proxies: [
        ...(customProxyGroup['💬 人工智能']?.proxies || []),
        ...areaProxyGroupName,
        ...proxies.map(item => item.name),
        'DIRECT'
      ]
    },
    {
      name: '🎮 游戏平台',
      type: 'select',
      proxies: ['🚀 节点选择', ...proxies.map(item => item.name), 'DIRECT']
    },
    ...areaProxyGroup,
    {
      name: '🐟 漏网之鱼',
      type: 'select',
      proxies: ['🚀 节点选择', 'DIRECT']
    },
    {
      name: '🛑 全球拦截',
      type: 'select',
      proxies: ['REJECT', 'DIRECT']
    }
  ]
}

/**
 * 规则
 */
const ruleProviders = {
  Apple: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple_Classical.yaml',
    format: 'yaml',
    path: './ruleset/Apple.yaml',
    interval: 86400
  },
  OneDrive: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OneDrive/OneDrive.yaml',
    format: 'yaml',
    path: './ruleset/OneDrive.yaml',
    interval: 86400
  },
  Microsoft: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml',
    format: 'yaml',
    path: './ruleset/Microsoft.yaml',
    interval: 86400
  },
  Game: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/Game.yaml',
    format: 'yaml',
    path: './ruleset/Game.yaml',
    interval: 86400
  },
  Download: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Download/Download.yaml',
    format: 'yaml',
    path: './ruleset/Download.yaml',
    interval: 86400
  },
  OpenAI: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/ericz15/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml',
    format: 'yaml',
    path: './ruleset/OpenAI.yaml',
    interval: 86400
  },
  Claude: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml',
    format: 'yaml',
    path: './ruleset/Claude.yaml',
    interval: 86400
  },
  Gemini: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.yaml',
    format: 'yaml',
    path: './ruleset/Gemini.yaml',
    interval: 86400
  },
  Google: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml',
    format: 'yaml',
    path: './ruleset/Google.yaml',
    interval: 86400
  },
  YouTube: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml',
    format: 'yaml',
    path: './ruleset/YouTube.yaml',
    interval: 86400
  },
  YouTubeMusic: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTubeMusic/YouTubeMusic.yaml',
    format: 'yaml',
    path: './ruleset/YouTubeMusic.yaml',
    interval: 86400
  },
  Telegram: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/ericz15/ios_rule_script/master/rule/Clash/Telegram/Telegram.yaml',
    format: 'yaml',
    path: './ruleset/Telegram.yaml',
    interval: 86400
  },
  GFW: {
    type: 'http',
    behavior: 'domain',
    url: 'https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt',
    path: './ruleset/GFW.yaml',
    interval: 86400
  },
  China: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/ericz15/ios_rule_script/master/rule/Clash/ChinaMax/ChinaMax_Classical.yaml',
    format: 'yaml',
    interval: 86400,
    path: './ruleset/China.yaml'
  },
  Lan: {
    type: 'http',
    behavior: 'classical',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml',
    format: 'yaml',
    path: './ruleset/Lan.yaml',
    interval: 86400
  }
}
const ruleSets = [
  'RULE-SET,OpenAI,💬 人工智能',
  'RULE-SET,Claude,💬 人工智能',
  'RULE-SET,Gemini,💬 人工智能',
  'RULE-SET,Download,⬇️ 低倍节点',
  'RULE-SET,Game,🎮 游戏平台',
  'RULE-SET,Apple,DIRECT',
  'RULE-SET,OneDrive,⬇️ 低倍节点',
  'RULE-SET,Microsoft,DIRECT',
  'RULE-SET,Google,🚀 节点选择',
  'RULE-SET,YouTube,🚀 节点选择',
  'RULE-SET,YouTubeMusic,🚀 节点选择',
  'RULE-SET,Telegram,🚀 节点选择',
  'RULE-SET,GFW,🚀 节点选择',
  'RULE-SET,China,DIRECT',
  'RULE-SET,Lan,DIRECT,no-resolve'
]
const customRules = [
  'DOMAIN-SUFFIX,githubusercontent.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,deb.debian.org,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,dl.google.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,storage.googleapis.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,production.cloudflare.docker.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,download-cdn.jetbrains.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,bard.google.com,💬 人工智能'
]
const rules = [
  ...customRules,
  ...ruleSets,
  'GEOIP,CN,DIRECT,no-resolve',
  'MATCH,🐟 漏网之鱼'
]

/**
 * 入口函数
 */
async function main(
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) {
  const clashConfig = yaml.parse(raw)
  const { proxies } = clashConfig
  const proxyGroups = proxyGroupsGenerator(proxies)

  clashConfig['dns'] = dnsConfig
  clashConfig['proxy-groups'] = proxyGroups
  clashConfig['rule-providers'] = ruleProviders
  clashConfig['rules'] = rules
  return yaml.stringify(clashConfig)
}

module.exports.parse = main

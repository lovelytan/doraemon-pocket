const areaSchema = {
  '🇭🇰 香港节点': {reg: /^(?!.*游戏).*(香港|🇭🇰|HongKong|HK)+(.*)$/},
  '🇨🇳 台湾节点': {reg: /^(?!.*游戏).*(台湾|🇨🇳|Taiwan|TW)+(.*)$/},
  '🇯🇵 日本节点': {reg: /^(?!.*游戏).*(日本|🇯🇵|Japan|JP|东京)+(.*)$/},
  '🇸🇬 新加坡节点': {reg: /^(?!.*游戏).*(新加坡|🇸🇬|Singapore|SG|狮城)+(.*)$/},
  '🇰🇷 韩国节点': {reg: /^(?!.*游戏).*(韩国|🇰🇷|Korea|Kr)+(.*)/},
  '🇺🇲 美国节点': {reg: /^(?!.*游戏).*(美国|🇺🇸|American|US)+(.*)$/},
  '🏳️‍🌈 其他地区': {reg: /^(?!.*游戏).*/}
}
const customSchema = {
  '⬇️ 低倍节点': {reg: /(?<![0-9])0\.[0-9]+|低倍/},
  '💬 人工智能': {reg: /^(?!.*游戏).*(ai|gpt)+(.*)/i}
}

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
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan_Resolve.yaml',
    format: 'yaml',
    path: './ruleset/Lan.yaml',
    interval: 86400
  }
}
const rules = [
  'DOMAIN-SUFFIX,deb.debian.org,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,dl.google.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,storage.googleapis.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,production.cloudflare.docker.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,download-cdn.jetbrains.com,⬇️ 低倍节点',
  'DOMAIN-SUFFIX,bard.google.com,💬 人工智能',
  'RULE-SET,OpenAI,💬 人工智能',
  'RULE-SET,Claude,💬 人工智能',
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
  'RULE-SET,Lan,DIRECT',
  'GEOIP,CN,DIRECT,no-resolve',
  'MATCH,🐟 漏网之鱼'
]

const dns = {
  enable: true,
  listen: '0.0.0.0:53',
  ipv6: false,

  // 查找 hosts 并返回 IP 记录
  'use-hosts': true,

  'enhanced-mode': 'fake-ip',
  // Fake IP 地址池 CIDR
  'fake-ip-range': '198.18.0.1/16',
  // 此列表中的主机名将不会使用 Fake IP 解析。
  // 即, 对这些域名的请求将始终使用其真实 IP 地址进行响应
  'fake-ip-filter': [
    '*.lan',
    '*.local',
    'localhost.ptlogin2.qq.com',
    '*.snapdrop.net'
  ],

  // 这些 名称服务器(nameservers) 用于解析下列 DNS 名称服务器主机名.
  // 仅指定 IP 地址
  'default-nameserver': [
    '119.29.29.29',
    '223.5.5.5',
    '1.0.0.1'
  ],
  // 支持 UDP、TCP、DoT、DoH. 您可以指定要连接的端口.
  // 所有 DNS 查询都直接发送到名称服务器, 无需代理
  // Clash 使用第一个收到的响应作为 DNS 查询的结果.
  nameserver: [
    '119.29.29.29', // 腾讯
    '223.5.5.5', // 阿里
    'https://1.12.12.12/dns-query', // 腾讯
    'https://223.5.5.5/dns-query', // 阿里
    'tls://1.12.12.12:853', // 腾讯
    'tls://dns.alidns.com:853', // 阿里
  ],
  // 当 `fallback` 存在时, DNS 服务器将向此部分中的服务器 与 `nameservers` 中的服务器发送并发请求
  // 当 GEOIP 国家不是 `CN` 时, 将使用 fallback 服务器的响应
  fallback: [
    '80.80.81.81',
    'https://223.5.5.5/dns-query',
    'https://dns.twnic.tw/dns-query', // 台湾101
    // 'https://1.0.0.1/dns-query', // Cloudflare
    // 'https://1.1.1.1/dns-query', // Cloudflare
    'https://doh.dns.sb/dns-query', // DNS.SB
    'https://dns.adguard.com/dns-query', // AdGuard
    'https://dns.quad9.net/dns-query', // IBM Quad9
    'tls://one.one.one.one:853', // Cloudflare
  ],
  // 如果使用 `nameservers` 解析的 IP 地址在下面指定的子网中,则认为它们无效, 并使用 `fallback` 服务器的结果.
  // 当 `fallback-filter.geoip` 为 true 且 IP 地址的 GEOIP 为 `CN` 时,将使用 `nameservers` 服务器解析的 IP 地址.
  // 如果 `fallback-filter.geoip` 为 false, 且不匹配 `fallback-filter.ipcidr`,则始终使用 `nameservers` 服务器的结果
  // 这是对抗 DNS 污染攻击的一种措施.
  'fallback-filter': {
    geoip: true,
    'geoip-code': 'CN',
    ipcidr: ['240.0.0.0/4', '0.0.0.0/32'],
    domain: [
      '+.google.com'
    ]
  }
}

function schemaParse(
  proxies,
  scheme,
  options = {skip: true, target: 'array'}
) {
  let proxyGroups = Object.entries(scheme).map(([name, item]) => {
    return {
      name,
      regExp: item.reg,
      type: item.type || 'url-test',
      url: 'http://www.gstatic.com/generate_204',
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

async function main(
  raw,
  {axios, yaml, notify, console},
  {name, url, interval, selected}
) {
  const params = yaml.parse(raw)
  const {proxies} = params

  const areaProxyGroup = schemaParse(proxies, areaSchema)
  const customProxyGroup = schemaParse(proxies, customSchema, {
    skip: false,
    target: 'object'
  })
  const areaProxyGroupName = areaProxyGroup.map(item => item.name)

  const proxyGroups = [
    {
      name: '🚀 节点选择',
      type: 'select',
      proxies: [
        '🗺 地区节点',
        'DIRECT',
        ...proxies.map(item => item.name)
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
      proxies: ['DIRECT', '🚀 节点选择', ...(customProxyGroup['⬇️ 低倍节点']?.proxies || [])]
    },
    {
      name: '💬 人工智能',
      type: 'select',
      proxies: [
        ...(customProxyGroup['💬 人工智能']?.proxies || []),
        ...areaProxyGroupName,
        'DIRECT'
      ]
    },
    {
      name: '🎮 游戏平台',
      type: 'select',
      proxies: ['🚀 节点选择', 'DIRECT']
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

  return yaml.stringify(
    Object.assign(params, {
      dns,
      'proxy-groups': proxyGroups,
      'rule-providers': ruleProviders,
      rules
    })
  )
}

module.exports.parse = main

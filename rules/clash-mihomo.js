// 国内DNS服务器
const domesticNameservers = [
  '119.29.29.29', // 腾讯
  '223.5.5.5', // 阿里
  'https://1.12.12.12/dns-query', // 腾讯
  'https://223.5.5.5/dns-query', // 阿里
  'tls://1.12.12.12:853', // 腾讯
  'tls://dns.alidns.com:853' // 阿里
]
// 国外DNS服务器
const foreignNameservers = [
  '1.0.0.1',
  '8.8.4.4',
  '80.80.81.81',
  'https://doh.dns.sb/dns-query', // DNS.SB
  'https://dns.twnic.tw/dns-query', // 台湾101
  'https://dns.adguard.com/dns-query', // AdGuard
  'https://dns.quad9.net/dns-query', // IBM Quad9
  'tls://one.one.one.one:853' // Cloudflare
]
// DNS配置
const dnsConfig = {
  enable: true,
  listen: '0.0.0.0:1053',
  ipv6: false,
  /**
   * 是否查询系统 hosts
   */
  'use-system-hosts': true,
  /**
   * 是否回应配置中的 hosts
   */
  'use-hosts': true,
  'cache-algorithm': 'arc',
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.1/16',
  /**
   * fake ip 过滤
   * 以下地址不会下发 fake ip 映射用于连接
   */
  'fake-ip-filter': [
    // 本地主机/设备
    '+.lan',
    '+.local',
    // Windows网络出现小地球图标
    '+.msftconnecttest.com',
    '+.msftncsi.com',
    // QQ快速登录检测失败
    'localhost.ptlogin2.qq.com',
    'localhost.sec.qq.com',
    // 微信快速登录检测失败
    'localhost.work.weixin.qq.com',
    '*.snapdrop.net'
  ],
  /**
   * 默认域名服务器
   * 用于解析 DNS 服务器 的域名
   */
  'default-nameserver': ['119.29.29.29', '223.5.5.5', '1.0.0.1'],

  /**
   * 直连域名解析的 DNS 服务器，可选
   * 如果不填则遵循nameserver-policy、nameserver和fallback的配置
   */
  'direct-nameserver': ['system'],
  /**
   * 是否再次匹配nameserver-policy
   * 仅当配置direct-nameserver时生效
   * 默认不遵守，直接使用direct-nameserver解析
   * 若遵守，则匹配nameserver-policy并查询，域名匹配失败使用direct-nameserver解析
   */
  'direct-nameserver-follow-policy': false,

  /**
   * 代理域名解析服务器
   * 不填则遵循nameserver-policy、nameserver和fallback的配置
   */
  'proxy-server-nameserver': foreignNameservers,
  /**
   * dns 连接遵守路由规则
   * 需配置 proxy-server-nameserver
   */
  'respect-rules': false,

  /**
   * 域名查询的解析服务器
   * 键支持域名通配、geosite；值支持字符串/数组
   * 匹配为并发查询，匹配成功返回IP；未匹配，继续匹配fallback规则
   */
  'nameserver-policy': {
    // '+.arpa': '10.0.0.1',
    'geosite:private,cn,geolocation-cn': domesticNameservers,
    'geosite:google,youtube,telegram,gfw,geolocation-!cn': foreignNameservers
  },

  /**
   * 后备域名解析服务器
   * 并发查询，一般情况下使用境外 DNS, 保证结果可信
   * 配置 fallback后默认启用 fallback-filter,geoip-code为 cn
   * 匹配成功，返回IP；
   * 匹配失败，继续nameserver
   */
  fallback: [
    '1.0.0.1',
    '8.8.4.4',
    '80.80.81.81',
    'https://doh.dns.sb/dns-query', // DNS.SB
    'https://dns.twnic.tw/dns-query', // 台湾101
    'https://dns.adguard.com/dns-query', // AdGuard
    'https://dns.quad9.net/dns-query', // IBM Quad9
    'tls://one.one.one.one:853' // Cloudflare
  ],
  /**
   * 后备域名解析服务器筛选
   * 满足条件的将使用 fallback 结果 或 只使用 fallback解析
   */
  'fallback-filter': {
    geoip: true,
    // 除了 geoip-code 配置的国家 IP, 其他的 IP 结果会被视为污染
    'geoip-code': 'CN',
    // geosite 列表的内容被视为已污染，匹配到 geosite 的域名，将只使用 fallback解析，不去使用 nameserver
    geosite: ['gfw'],
    // 网段的结果会被视为污染
    ipcidr: ['240.0.0.0/4', '0.0.0.0/32'],
    // 域名被视为已污染
    domain: ['+.google.com']
  },

  /**
   * 默认的域名解析服务器
   * 并发查询，解析ip
   * 将解析的ip再次匹配 fallback 的 ip 规则
   * 匹配成功，fallback对原域名并发查询
   * 匹配失败，返回ip
   */
  nameserver: [...domesticNameservers, ...foreignNameservers]
}

const areaGroupRegs = {
  '🇭🇰 香港节点': { reg: /^(?!.*游戏).*(香港|🇭🇰|HongKong|HK)+(.*)$/ },
  '🇨🇳 台湾节点': { reg: /^(?!.*游戏).*(台湾|🇨🇳|Taiwan|TW)+(.*)$/ },
  '🇯🇵 日本节点': { reg: /^(?!.*游戏).*(日本|🇯🇵|Japan|JP|东京)+(.*)$/ },
  '🇸🇬 新加坡节点': { reg: /^(?!.*游戏).*(新加坡|🇸🇬|Singapore|SG|狮城)+(.*)$/ },
  '🇰🇷 韩国节点': { reg: /^(?!.*游戏).*(韩国|🇰🇷|Korea|Kr)+(.*)/ },
  '🇺🇲 美国节点': { reg: /^(?!.*游戏).*(美国|🇺🇸|American|US)+(.*)$/ },
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
      proxies: ['🗺 地区节点', 'DIRECT', ...proxies.map(item => item.name)]
    },
    {
      name: '🗺 地区节点',
      type: 'select',
      proxies: areaProxyGroupName
    },
    {
      name: '⬇️ 低倍节点',
      type: 'select',
      proxies: [
        'DIRECT',
        '🚀 节点选择',
        ...(customProxyGroup['⬇️ 低倍节点']?.proxies || [])
      ]
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
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.yaml',
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
  'RULE-SET,Lan,DIRECT,no-resolve',
  'GEOIP,CN,DIRECT,no-resolve',
  'MATCH,🐟 漏网之鱼'
]

function main(clashMeta, profileName) {
  const { proxies } = clashMeta
  const proxyGroups = proxyGroupsGenerator(proxies)

  clashMeta['dns'] = dnsConfig
  clashMeta['proxy-groups'] = proxyGroups
  clashMeta['rule-providers'] = ruleProviders
  clashMeta['rules'] = rules
  return clashMeta
}

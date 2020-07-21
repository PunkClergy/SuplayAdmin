import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/analysis/index',
            },
            {
              path: '/analysis',
              name: '数据统计',
              icon: 'BarChartOutlined',
              routes: [
                {
                  name: '数据总览',
                  icon: 'BarChartOutlined',
                  path: '/analysis/overview',
                  component: './analysis/Overview',
                },
                {
                  name: '盲盒销售',
                  icon: 'DotChartOutlined',
                  path: '/analysis/index',
                  component: './analysis/SaleList',
                },
                {
                  name: '直购销售',
                  icon: 'FundOutlined',
                  path: '/analysis/shop',
                  component: './analysis/ShopSaleList',
                },
                {
                  name: '优惠券统计',
                  icon: 'PieChartOutlined',
                  path: '/analysis/coupon',
                  component: './analysis/CouponSaleList',
                },
              ],
            },
            {
              name: '抽选列表',
              icon: 'GiftOutlined',
              path: '/lotteries',
              component: './LotteryList',
            },
            {
              name: '抽选详情',
              path: '/lottery/:id/detail',
              component: './LotteryDetail',
              hideInMenu: true,
            },
            {
              name: '盲盒列表',
              icon: 'DropboxOutlined',
              path: '/boxes',
              component: './BoxList',
            },
            {
              name: '盲盒详情',
              path: '/box/:id/detail',
              component: './BoxDetail',
              hideInMenu: true,
            },
            {
              name: '直购列表',
              path: '/shops',
              icon: 'ShoppingOutlined',
              component: './ShopList',
            },
            {
              path: '/shop/:id/detail',
              name: '直购详情',
              component: './ShopDetail',
              hideInMenu: true,
            },
            {
              name: '福袋列表',
              icon: 'SmileOutlined',
              path: '/luckyBags',
              component: './LuckyBagList',
            },
            {
              name: '福袋详情',
              path: '/sales/LuckyBag/:id/detail',
              component: './LuckyBagDetail',
              hideInMenu: true,
            },
            {
              name: '订单列表',
              path: '/orders',
              icon: 'SolutionOutlined',
              component: './OrderList',
            },
            {
              name: '订单详情',
              path: '/order/:id/detail',
              component: './OrderDetail',
              hideInMenu: true,
            },
            {
              name: '盒柜管理',
              path: '/cabinet',
              icon: 'SwitcherOutlined',
              routes: [
                {
                  name: '盒柜列表',
                  path: '/cabinet/index',
                  icon: 'PicCenterOutlined',
                  component: './cabinet/CabinetList',
                },
                {
                  name: '盒柜详情',
                  path: '/cabinet/detail/:id',
                  component: './cabinet/cabinetDetail',
                  hideInMenu: true,
                },
                {
                  name: '交换列表',
                  path: '/cabinet/switches',
                  icon: 'SwitcherOutlined',
                  component: './cabinet/SwitchList',
                },
                {
                  name: '交换详情',
                  path: '/cabinet/switchesDetail/:id',
                  component: './cabinet/SwitchDetail',
                  hideInMenu: true,
                },
                {
                  name: '二手列表',
                  path: '/cabinet/trades',
                  icon: 'ShoppingOutlined',
                  component: './cabinet/TradesList',
                },
              ],
            },
            {
              path: '/operating',
              name: '运营管理',
              icon: 'CalendarOutlined',
              routes: [
                {
                  name: '首页管理',
                  icon: 'HomeOutlined',
                  path: '/operating/home',
                  component: './operating/HomeMent',
                },
                {
                  name: '会场列表',
                  icon: 'GatewayOutlined',
                  path: '/operating/exhibition',
                  component: './operating/exhibitionList',
                },
                {
                  name: '会场详情',
                  path: '/operating/exhibitionDetail/:id',
                  component: './operating/exhibitionDetail',
                  hideInMenu: true,
                },
                {
                  name: '签到列表',
                  icon: 'CarryOutOutlined',
                  path: '/operating/chekins',
                  component: './operating/CheckinLists',
                },
                {
                  name: '轮播图列表',
                  icon: 'InteractionOutlined',
                  path: '/operating/banners',
                  component: './operating/BannerList',
                },
                {
                  name: '直播列表',
                  icon: 'PlayCircleOutlined',
                  path: '/operating/liverooms',
                  component: './operating/LiveRoomList',
                },
                {
                  name: '优惠券列表',
                  icon: 'SlackOutlined',
                  path: '/operating/coupons',
                  component: './operating/CouponList',
                },
                {
                  name: '黑名单列表',
                  icon: 'StopOutlined',
                  path: '/operating/blacklists',
                  component: './operating/BlackList',
                },
              ],
            },
            {
              path: '/product',
              name: '产品管理',
              icon: 'InboxOutlined',
              routes: [
                {
                  name: '商品列表',
                  icon: 'rocket',
                  path: '/product/index',
                  component: './product/ProductList',
                },
                {
                  name: '商品详情',
                  path: '/product/detail/:id',
                  component: './product/ProductDetail',
                  hideInMenu: true,
                },
                {
                  name: '系列列表',
                  icon: 'MenuOutlined',
                  path: '/product/series',
                  component: './product/SeriesList',
                },
                {
                  name: '系列详情',
                  path: '/product/series/detail/:id',
                  component: './product/SeriesList/detail',
                  hideInMenu: true,
                },
                {
                  name: '品牌列表',
                  icon: 'TrademarkCircleOutlined',
                  path: '/product/brands',
                  component: './product/BrandList',
                },
              ],
            },
            {
              path: '/wallet',
              name: '交易管理',
              icon: 'MoneyCollectOutlined',
              routes: [
                {
                  name: '支付明细',
                  icon: 'UnorderedListOutlined',
                  path: '/wallet/index',
                  component: './wallet/PaymentsList',
                },
                {
                  name: '提现列表',
                  icon: 'PropertySafetyOutlined',
                  path: '/wallet/requests',
                  component: './wallet/RequestList',
                },
                {
                  name: '对账列表',
                  icon: 'ProfileOutlined',
                  path: '/wallet/bill',
                  component: './wallet/BillList',
                },
              ],
            },
            {
              path: '/customer',
              name: '用户管理',
              icon: 'UserSwitchOutlined',
              routes: [
                {
                  name: '用户列表',
                  icon: 'UnorderedListOutlined',
                  path: '/customer/index',
                  component: './customer/CustomerList',
                },
                {
                  name: '用户详情',
                  path: '/customer/:id/detail',
                  component: './customer/CustomerDetail/index',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/help',
              name: '帮助中心',
              icon: 'BulbOutlined',
              routes: [
                {
                  name: '管理员列表',
                  icon: 'crown',
                  path: '/help/admins',
                  component: './help/Admins',
                },
                {
                  path: '/help/center',
                  name: '个人中心',
                  icon: 'UserOutlined',
                  component: './help/PersonalCenter',
                },
                {
                  path: '/help/logs',
                  name: '操作日志',
                  icon: 'ReadOutlined',
                  component: './help/LogList',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: process.env.API_SERVER,
      changeOrigin: true,
    },
  },
  history: 'hash',
  treeShaking: true,
};

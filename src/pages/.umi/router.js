import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux, dynamic as _dvaDynamic } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__login" */ '../user/login'),
              LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../user/login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__SecurityLayout" */ '../../layouts/SecurityLayout'),
          LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/SecurityLayout').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
              LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/BasicLayout').default,
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/analysis/index',
            exact: true,
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__analysis__Overview__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/analysis/Overview/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../analysis/Overview'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../analysis/Overview').default,
                exact: true,
              },
              {
                name: '盲盒销售',
                icon: 'DotChartOutlined',
                path: '/analysis/index',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../analysis/SaleList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../analysis/SaleList').default,
                exact: true,
              },
              {
                name: '直购销售',
                icon: 'FundOutlined',
                path: '/analysis/shop',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../analysis/ShopSaleList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../analysis/ShopSaleList').default,
                exact: true,
              },
              {
                name: '优惠券统计',
                icon: 'PieChartOutlined',
                path: '/analysis/coupon',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../analysis/CouponSaleList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../analysis/CouponSaleList').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '抽选列表',
            icon: 'GiftOutlined',
            path: '/lotteries',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__LotteryList" */ '../LotteryList'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../LotteryList').default,
            exact: true,
          },
          {
            name: '抽选详情',
            path: '/lottery/:id/detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LotteryDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/LotteryDetail/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LotteryDetail" */ '../LotteryDetail'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../LotteryDetail').default,
            hideInMenu: true,
            exact: true,
          },
          {
            name: '盲盒列表',
            icon: 'DropboxOutlined',
            path: '/boxes',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__BoxList" */ '../BoxList'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../BoxList').default,
            exact: true,
          },
          {
            name: '盲盒详情',
            path: '/box/:id/detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__BoxDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/BoxDetail/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__BoxDetail" */ '../BoxDetail'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../BoxDetail').default,
            hideInMenu: true,
            exact: true,
          },
          {
            name: '直购列表',
            path: '/shops',
            icon: 'ShoppingOutlined',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__ShopList" */ '../ShopList'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../ShopList').default,
            exact: true,
          },
          {
            path: '/shop/:id/detail',
            name: '直购详情',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ShopDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/ShopDetail/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ShopDetail" */ '../ShopDetail'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../ShopDetail').default,
            hideInMenu: true,
            exact: true,
          },
          {
            name: '福袋列表',
            icon: 'SmileOutlined',
            path: '/luckyBags',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__LuckyBagList" */ '../LuckyBagList'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../LuckyBagList').default,
            exact: true,
          },
          {
            name: '福袋详情',
            path: '/sales/LuckyBag/:id/detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__LuckyBagDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/LuckyBagDetail/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__LuckyBagDetail" */ '../LuckyBagDetail'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../LuckyBagDetail').default,
            hideInMenu: true,
            exact: true,
          },
          {
            name: '订单列表',
            path: '/orders',
            icon: 'SolutionOutlined',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderList__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/OrderList/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderList" */ '../OrderList'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderList').default,
            exact: true,
          },
          {
            name: '订单详情',
            path: '/order/:id/detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__OrderDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/OrderDetail/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__OrderDetail" */ '../OrderDetail'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../OrderDetail').default,
            hideInMenu: true,
            exact: true,
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../cabinet/CabinetList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../cabinet/CabinetList').default,
                exact: true,
              },
              {
                name: '盒柜详情',
                path: '/cabinet/detail/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__cabinet__cabinetDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/cabinet/cabinetDetail/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../cabinet/cabinetDetail'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../cabinet/cabinetDetail').default,
                hideInMenu: true,
                exact: true,
              },
              {
                name: '交换列表',
                path: '/cabinet/switches',
                icon: 'SwitcherOutlined',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../cabinet/SwitchList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../cabinet/SwitchList').default,
                exact: true,
              },
              {
                name: '交换详情',
                path: '/cabinet/switchesDetail/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__cabinet__SwitchDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/cabinet/SwitchDetail/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../cabinet/SwitchDetail'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../cabinet/SwitchDetail').default,
                hideInMenu: true,
                exact: true,
              },
              {
                name: '二手列表',
                path: '/cabinet/trades',
                icon: 'ShoppingOutlined',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../cabinet/TradesList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../cabinet/TradesList').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__operating__HomeMent__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/operating/HomeMent/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/HomeMent'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/HomeMent').default,
                exact: true,
              },
              {
                name: '会场列表',
                icon: 'GatewayOutlined',
                path: '/operating/exhibition',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/exhibitionList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/exhibitionList').default,
                exact: true,
              },
              {
                name: '会场详情',
                path: '/operating/exhibitionDetail/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__operating__exhibitionDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/operating/exhibitionDetail/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/exhibitionDetail'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/exhibitionDetail').default,
                hideInMenu: true,
                exact: true,
              },
              {
                name: '签到列表',
                icon: 'CarryOutOutlined',
                path: '/operating/chekins',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/CheckinLists'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/CheckinLists').default,
                exact: true,
              },
              {
                name: '轮播图列表',
                icon: 'InteractionOutlined',
                path: '/operating/banners',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/BannerList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/BannerList').default,
                exact: true,
              },
              {
                name: '直播列表',
                icon: 'PlayCircleOutlined',
                path: '/operating/liverooms',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/LiveRoomList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/LiveRoomList').default,
                exact: true,
              },
              {
                name: '优惠券列表',
                icon: 'SlackOutlined',
                path: '/operating/coupons',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/CouponList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/CouponList').default,
                exact: true,
              },
              {
                name: '黑名单列表',
                icon: 'StopOutlined',
                path: '/operating/blacklists',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../operating/BlackList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../operating/BlackList').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../product/ProductList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../product/ProductList').default,
                exact: true,
              },
              {
                name: '商品详情',
                path: '/product/detail/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__product__ProductDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/product/ProductDetail/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../product/ProductDetail'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../product/ProductDetail').default,
                hideInMenu: true,
                exact: true,
              },
              {
                name: '系列列表',
                icon: 'MenuOutlined',
                path: '/product/series',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../product/SeriesList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../product/SeriesList').default,
                exact: true,
              },
              {
                name: '系列详情',
                path: '/product/series/detail/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../product/SeriesList/detail'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../product/SeriesList/detail').default,
                hideInMenu: true,
                exact: true,
              },
              {
                name: '品牌列表',
                icon: 'TrademarkCircleOutlined',
                path: '/product/brands',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../product/BrandList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../product/BrandList').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../wallet/PaymentsList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../wallet/PaymentsList').default,
                exact: true,
              },
              {
                name: '提现列表',
                icon: 'PropertySafetyOutlined',
                path: '/wallet/requests',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../wallet/RequestList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../wallet/RequestList').default,
                exact: true,
              },
              {
                name: '对账列表',
                icon: 'ProfileOutlined',
                path: '/wallet/bill',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__wallet__BillList__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/wallet/BillList/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../wallet/BillList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../wallet/BillList').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../customer/CustomerList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../customer/CustomerList').default,
                exact: true,
              },
              {
                name: '用户详情',
                path: '/customer/:id/detail',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__customer__CustomerDetail__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/customer/CustomerDetail/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../customer/CustomerDetail/index'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../customer/CustomerDetail/index').default,
                hideInMenu: true,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
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
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../help/Admins'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../help/Admins').default,
                exact: true,
              },
              {
                path: '/help/center',
                name: '个人中心',
                icon: 'UserOutlined',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__help__PersonalCenter__model.js' */ '/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/pages/help/PersonalCenter/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../help/PersonalCenter'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../help/PersonalCenter').default,
                exact: true,
              },
              {
                path: '/help/logs',
                name: '操作日志',
                icon: 'ReadOutlined',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../help/LogList'),
                      LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../help/LogList').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('/Users/chaojiwanka-web/Desktop/suplay-Admin/suplay-admin-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}

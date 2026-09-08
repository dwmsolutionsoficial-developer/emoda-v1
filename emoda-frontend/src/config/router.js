import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import Auth from '@/components/auth/Auth'
import Banco from '@/components/banco/Banco'
import Grupo from '@/components/grupo/Grupo'
import Marca from '@/components/marca/Marca'
import Cor from '@/components/cor/Cor'
import Tamanho from '@/components/tamanho/Tamanho'
import Unidade from '@/components/unidade/Unidade'
import Cliente from '@/components/cliente/Cliente'
import Fornecedor from '@/components/fornecedor/Fornecedor'
import Produto from '@/components/produto/Produto'
import CaixaPages from '@/components/caixa/CaixaPages'
import ConsignadoPages from '@/components/consignado/ConsignadoPages'
import NovoConsignado from '@/components/consignado/NovoConsignado'
import ReceberPages from '@/components/receber/ReceberPages'
import ClientesAVencer from '@/components/cliente/ClientesAVencer'
import NotasVersao from '@/components/notasVersao/notasVersao'
import RealizarVenda from '@/components/venda/RealizarVenda'
import RelatorioPages from '@/components/relatorio/RelatorioPages'
import DevolucaoPages from '@/components/devolucao/DevolucaoPages'
import ListarVendas from '@/components/venda/ListarVendas'
import RealizarCompra from '@/components/compra/Compra'

import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
    meta: { requiresAdmin: true }
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
},
{
    name: 'banco',
    path: '/banco',
    component: Banco,
    meta: { acessaBanco: true }
},
{
    name: 'grupo',
    path: '/grupo',
    component: Grupo,
    meta: { acessaGrupo: true }
},
{
    name: 'marca',
    path: '/marca',
    component: Marca,
    meta: { acessaMarca: true }
},
{
    name: 'cor',
    path: '/cor',
    component: Cor,
    meta: { acessaCor: true }
},
{
    name: 'tamanho',
    path: '/tamanho',
    component: Tamanho,
    meta: { acessaTamanho: true }
},
{
    name: 'unidade',
    path: '/unidade',
    component: Unidade,
    meta: { acessaUnidade: true }
},
{
    name: 'cliente',
    path: '/cliente',
    component: Cliente,
    meta: { acessaCliente: true }
},
{
    name: 'fornecedor',
    path: '/fornecedor',
    component: Fornecedor,
    meta: { acessaFornecedor: true }
},
{
    name: 'produto',
    path: '/produto',
    component: Produto,
    meta: { acessaProduto: true }
},
{
    name: 'caixaPages',
    path: '/caixa',
    component: CaixaPages,
    meta: { acessaCaixa: true }
},
{
    name: 'consignadoPages',
    path: '/consignado',
    component: ConsignadoPages,
    meta: { acessaConsignado: true }
},
{
    name: 'novoConsignado',
    path: '/novoConsignado',
    component: NovoConsignado,
    meta: { acessaConsignado: true }
},
{
    name: 'receberPages',
    path: '/receber',
    component: ReceberPages,
    meta: { acessaReceber: true }
},
{
    name: 'clientesAVencer',
    path: '/clientesAVencer',
    component: ClientesAVencer,
    meta: { acessaClientesAVencer: true }
},
{
    name: 'notasVersao',
    path: '/notasVersao',
    component: NotasVersao
},
{
    name: 'realizarVenda',
    path: '/realizarVenda',
    component: RealizarVenda,
    meta: { acessaVendas: true }
},
{
    name: 'relatorioPages',
    path: '/relatorio',
    component: RelatorioPages,
    meta: { acessaRelatorios: true }
},
{
    name: 'devolucaoPages',
    path: '/devolucao',
    component: DevolucaoPages,
    meta: { acessaDevolucoes: true }
},
{
    name: 'listarVendas',
    path: '/listarVendas',
    component: ListarVendas,
    meta: { acessaVendas: true }
},
{
    name: 'realizarCompra',
    path: '/realizarCompra',
    component: RealizarCompra,
    //meta: { acessaCompras: true }
},
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)
    const user = JSON.parse(json)

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        user && user.admin ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaBanco)) {
        user && user.exibeBanco ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaGrupo)) {
        user && user.exibeGrupo ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaMarca)) {
        user && user.exibeMarca ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaCor)) {
        user && user.exibeCor ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaTamanho)) {
        user && user.exibeTamanho ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaUnidade)) {
        user && user.exibeUnidade ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaCliente)) {
        user && user.exibeCliente ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaFornecedor)) {
        user && user.exibeFornecedor ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaProduto)) {
        user && user.exibeProduto ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaCaixa)) {
        user && user.exibeCaixa ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaConsignado)) {
        user && user.exibeConsignado ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaReceber)) {
        user && user.exibeReceber ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaClientesAVencer)) {
        user && user.exibeClientesVencer ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaVendas)) {
        user && user.exibeVendas ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaRelatorios)) {
        user && user.exibeRelatorios ? next() : next({ path: '/' })
    } else if (to.matched.some(record => record.meta.acessaDevolucoes)) {
        user && user.exibeDevolucoes ? next() : next({ path: '/' })
    }
    else {
        next()
    }
})

export default router

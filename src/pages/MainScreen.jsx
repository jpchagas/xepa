// React
import { useCallback, useEffect, useMemo, useState } from 'react'

// Third-party
import {
  Box,
  Button,
  Container,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'

// Routing
import { useSearchParams } from 'react-router-dom'

// Components
import AdBanner from '../components/feedback/AdBanner'
import AppSnackbar from '../components/feedback/AppSnackbar'
import ConfirmDialog from '../components/feedback/ConfirmDialog'
import MainBottomNavigation from '../components/navigation/MainBottomNavigation'
import NotificationsDialog from '../features/notifications/NotificationsDialog'
import RecipeDialog from '../features/recipes/RecipeDialog'
import RecipesPanel from '../features/recipes/RecipesPanel'
import ChangePasswordDialog from '../features/settings/ChangePasswordDialog'
import SettingsPanel from '../features/settings/SettingsPanel'
import AddItemDialog from '../features/shopping/AddItemDialog'
import AddItemFab from '../features/shopping/AddItemFab'
import CreateListDialog from '../features/shopping/CreateListDialog'
import ListHeader from '../features/shopping/ListHeader'
import ListSummary from '../features/shopping/ListSummary'
import MembersDialog from '../features/shopping/MembersDialog'
import ShoppingList from '../features/shopping/ShoppingList'
import SwapDialog from '../features/shopping/SwapDialog'

// Hooks
import useAlert from '../hooks/useAlert'
import useCeasaSync from '../hooks/useCeasaSync'
import useListMembers from '../hooks/useListMembers'
import useNotificationPrefs from '../hooks/useNotificationPrefs'
import useNotifications from '../hooks/useNotifications'
import usePassword from '../hooks/usePassword'
import useProducts from '../hooks/useProducts'
import usePushNotifications from '../hooks/usePushNotifications'
import useShoppingItems from '../hooks/useShoppingItems'
import useShoppingLists from '../hooks/useShoppingLists'

// Data
import NUTRITION from '../data/nutrition'
import recipes, { RECIPE_CATEGORIES } from '../data/recipes'
import { FOOD_PRODUCTS, SEASONS } from '../data/seasons'
import SWAP_GROUPS from '../data/swapGroups'

// Utils
import {
  calculateSavings,
  calculateTotalPrice,
  getLatestFileDate,
  getProductLabel,
  normalizeText,
  sortItemsByName
} from '../utils/shoppingHelpers'
import { getSeason, getSeasonalProductIds } from '../utils/seasonHelpers'
import { buildSwapIndex, findSwap } from '../utils/swapHelpers'


const TABS = ['list', 'recipes', 'settings']

const SWAP_INDEX = buildSwapIndex(SWAP_GROUPS)

// Season at app start; nobody keeps the app open across a solstice.
const SEASON = getSeason(SEASONS)
const SEASONAL_IDS = getSeasonalProductIds(SEASON, FOOD_PRODUCTS)


const ADMIN_EMAIL = 'jpchagas@gmail.com'

const GENERIC_ERROR =
  'Algo deu errado. Verifique sua conexão e tente novamente.'

const countLabel = (count, singular, plural) =>
  `${count} ${count === 1 ? singular : plural}`


function ListsPlaceholder({ failed }) {
  if (failed) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
        <Typography variant="h6" component="p">
          Não foi possível carregar suas listas
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Verifique sua conexão com a internet.
        </Typography>

        <Button variant="contained" onClick={() => window.location.reload()}>
          Tentar de novo
        </Button>
      </Box>
    )
  }

  return (
    <Stack spacing={1.5} sx={{ pt: 'calc(16px + env(safe-area-inset-top))' }}>
      <Skeleton variant="text" width="55%" height={44} />
      <Skeleton variant="rounded" height={150} sx={{ borderRadius: '24px' }} />
      <Skeleton variant="rounded" height={96} sx={{ borderRadius: '18px' }} />
      <Skeleton variant="rounded" height={96} sx={{ borderRadius: '18px' }} />
    </Stack>
  )
}


function MainScreen({ user }) {
  // The tab lives in the URL so "back" from Privacy/Contact
  // returns to Settings.
  const [searchParams, setSearchParams] = useSearchParams()

  const tab =
    TABS.includes(searchParams.get('tab'))
      ? searchParams.get('tab')
      : 'list'

  const [addItemOpen, setAddItemOpen] = useState(false)
  const [createListOpen, setCreateListOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [openRecipe, setOpenRecipe] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [openSwap, setOpenSwap] = useState(null)


  const {
    alert,
    showAlert,
    closeAlert
  } = useAlert()

  const showError = useCallback(
    () => showAlert('error', GENERIC_ERROR),
    [showAlert]
  )

  const {
    products
  } = useProducts()

  const {
    lists,
    loading: listsLoading,
    selectedList,
    selectList,
    createList,
    removeMember,
    leaveList,
    shareList,
    deleteList
  } = useShoppingLists(user)

  const members =
    useListMembers(selectedList)

  const {
    items,
    loading: itemsLoading,
    addItem,
    addRecipeItems,
    updateAmount,
    setItemPrice,
    swapItem,
    undoSwap,
    dismissSwap,
    toggleChecked,
    removeItem,
    restoreItem,
    clearItems,
    removeCheckedItems
  } = useShoppingItems(
    selectedList?.id,
    products,
    { onError: showError, userId: user?.uid }
  )

  const {
    newPassword,
    setNewPassword,
    passwordError,
    loading: passwordLoading,
    changePassword,
    resetPasswordForm,
    logout
  } = usePassword()

  const {
    status: ceasaStatus,
    refreshing,
    refresh: refreshPrices
  } = useCeasaSync()

  const push = usePushNotifications(user)
  const notificationPrefs = useNotificationPrefs(user)

  const {
    notifications,
    unreadCount,
    markAllRead
  } = useNotifications(user, {
    onArrive: handleNotificationArrive
  })


  // Notification links open a list: /main?list=<id>
  const linkedListId = searchParams.get('list')

  useEffect(() => {
    if (!linkedListId || lists.length === 0) return

    if (lists.some(list => list.id === linkedListId)) {
      selectList(linkedListId)
    }

    setSearchParams(
      previous => {
        const next = new URLSearchParams(previous)

        next.delete('list')
        next.delete('tab')

        return next
      },
      { replace: true }
    )
  }, [linkedListId, lists, selectList, setSearchParams])


  const isAdmin = user?.email === ADMIN_EMAIL
  const isOwner = selectedList?.ownerId === user?.uid


  const productsById = useMemo(
    () => new Map(products.map(product => [product.id, product])),
    [products]
  )

  // Recipes name generic ingredients, so branded products are left out.
  const productsByName = useMemo(
    () =>
      new Map(
        products
          .filter(product => !product.brand)
          .map(product => [normalizeText(product.name), product])
      ),
    [products]
  )

  const listProductIds = useMemo(
    () => new Set(items.map(item => item.productId)),
    [items]
  )

  const { pendingItems, checkedItems } = useMemo(() => {
    const sorted = sortItemsByName(items, productsById)

    return {
      pendingItems: sorted.filter(item => !item.checked),
      checkedItems: sorted.filter(item => item.checked)
    }
  }, [items, productsById])

  // Cheaper, nutritionally similar alternatives (utils/swapHelpers).
  const swaps = useMemo(() => {
    const context = {
      productsById,
      swapIndex: SWAP_INDEX,
      nutrition: NUTRITION,
      listProductIds
    }

    const result = new Map()

    pendingItems.forEach(item => {
      const swap = findSwap(item, context)

      if (swap) result.set(item.id, swap)
    })

    return result
  }, [pendingItems, productsById, listProductIds])

  const swapSavings = [...swaps.values()].reduce(
    (sum, swap) => sum + swap.savings,
    0
  )

  const total = calculateTotalPrice(items, productsById)
  const cartTotal = calculateTotalPrice(checkedItems, productsById)
  const savings = calculateSavings(items, productsById)
  const priceDate = getLatestFileDate(items, productsById)

  const getItemName = item =>
    getProductLabel(productsById.get(item.productId), item.productId)


  /** Helpers */

  const changeTab = next => {
    setSearchParams(
      next === 'list' ? {} : { tab: next },
      { replace: true }
    )

    window.scrollTo(0, 0)
  }

  // For awaited actions: surfaces failures instead of failing silently.
  const runSafely = async (action, successMessage) => {
    try {
      await action()

      if (successMessage) showAlert('success', successMessage)
    } catch (error) {
      console.error(error)
      showError()
    }
  }

  // Bulk removals get an undo instead of a confirmation.
  const removeWithUndo = (removedItems, message) => {
    showAlert('info', message, {
      label: 'Desfazer',
      onClick: () => removedItems.forEach(restoreItem)
    })
  }


  /** Items */

  const handleAddItem = async newItem => {
    try {
      return await addItem(newItem)
    } catch (error) {
      console.error(error)
      showError()
      return null
    }
  }

  const handleRemoveItem = item => {
    removeItem(item)
    removeWithUndo([item], `${getItemName(item)} removido`)
  }

  const handleRemoveChecked = () => {
    const removed = checkedItems

    removeCheckedItems()
    removeWithUndo(
      removed,
      countLabel(removed.length, 'item removido', 'itens removidos')
    )
  }

  const handleClearItems = () => {
    const removed = items

    clearItems()
    removeWithUndo(removed, 'Lista limpa')
  }


  /** Lists */

  const handleCreateList = name => {
    const created = createList(name)

    setCreateListOpen(false)

    if (!created) return

    created.write.catch(error => {
      console.error(error)
      showError()
    })

    showAlert('success', `Lista “${name}” criada`)
  }

  const handleInvite = async email => {
    try {
      const result = await shareList(email)

      if (result.success) {
        showAlert('success', `Lista compartilhada com ${email}`)
        return null
      }

      if (result.reason === 'not-found') {
        return 'Não encontramos uma conta com este email.'
      }

      if (result.reason === 'already-member') {
        return 'Essa pessoa já tem acesso à lista.'
      }

      return 'Digite um email válido.'
    } catch (error) {
      console.error(error)
      return 'Não foi possível compartilhar. Tente novamente.'
    }
  }

  const handleRemoveMember = member =>
    setConfirm({
      title: 'Remover acesso?',
      message: `${member.email} não poderá mais ver nem editar “${selectedList.name}”.`,
      confirmLabel: 'Remover',
      destructive: true,
      onConfirm: () =>
        runSafely(() => removeMember(member.id), 'Acesso removido')
    })

  const handleLeaveList = () =>
    setConfirm({
      title: `Sair de “${selectedList.name}”?`,
      message: 'Você deixa de ver esta lista até ser convidado de novo.',
      confirmLabel: 'Sair da lista',
      destructive: true,
      onConfirm: () => runSafely(leaveList, 'Você saiu da lista')
    })

  const handleDeleteList = () =>
    setConfirm({
      title: `Excluir “${selectedList.name}”?`,
      message:
        members.length > 1
          ? 'A lista e todos os itens serão apagados para todas as pessoas com acesso.'
          : 'A lista e todos os itens serão apagados.',
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: () => runSafely(deleteList, 'Lista excluída')
    })


  /** Swaps */

  const handleSwap = () => {
    const { item, swap } = openSwap
    const fromName = swap.current.product.name
    const toName = swap.alternative.product.name

    swapItem(item, swap.alternative.product, fromName)
    setOpenSwap(null)

    showAlert('success', `${fromName} trocado por ${toName}`, {
      label: 'Desfazer',
      onClick: () => undoSwap(item)
    })
  }

  const handleKeep = () => {
    const { item, swap } = openSwap

    dismissSwap(item, swap.alternative.product.id)
    setOpenSwap(null)
  }


  /** Recipes */

  const handleAddRecipe = (entries, recipe) => {
    const result = addRecipeItems(entries, recipe.name)

    setOpenRecipe(null)

    if (!result) return

    const total = result.added + result.updated

    showAlert(
      'success',
      `${countLabel(total, 'item', 'itens')} de ${recipe.name} na lista`,
      { label: 'Ver lista', onClick: () => changeTab('list') }
    )
  }


  /** Prices */

  const handleRefreshPrices = async () => {
    try {
      const { importedDates, updatedProducts } = await refreshPrices()

      showAlert(
        'success',
        importedDates.length > 0
          ? `${countLabel(importedDates.length, 'cotação importada', 'cotações importadas')} · ${updatedProducts} produtos atualizados`
          : 'Os preços já estão atualizados'
      )
    } catch (error) {
      console.error(error)
      showAlert('error', 'Não foi possível atualizar os preços. Tente novamente.')
    }
  }


  /** Account */

  const handleChangePassword = async () => {
    const changed = await changePassword()

    if (changed) {
      setPasswordOpen(false)
      showAlert('success', 'Senha alterada com sucesso')
    }
  }

  /** Notifications */

  function openNotification(notification) {
    if (lists.some(list => list.id === notification.listId)) {
      selectList(notification.listId)
    }

    setNotificationsOpen(false)
    changeTab('list')
  }

  // A notification arrived (or grew) while the app is open.
  function handleNotificationArrive(notification) {
    const message =
      notification.type === 'price_increase'
        ? `${notification.title}: ${notification.body}`
        : `${notification.body} · ${notification.listName}`

    showAlert('info', message, {
      label: 'Ver',
      onClick: () => openNotification(notification)
    })
  }

  const handleOpenNotifications = () => {
    setNotificationsOpen(true)
    markAllRead()
  }

  const handleTogglePush = async () => {
    try {
      if (push.enabled) {
        await push.disable()
        showAlert('info', 'Notificações desativadas neste aparelho')
        return
      }

      const enabled = await push.enable()

      showAlert(
        enabled ? 'success' : 'warning',
        enabled
          ? 'Pronto! Você vai receber notificações neste aparelho.'
          : 'Permissão negada. Libere as notificações nas configurações do navegador.'
      )
    } catch (error) {
      console.error(error)
      showAlert('error', 'Não foi possível ativar as notificações.')
    }
  }

  const handleTogglePreference = key => {
    notificationPrefs
      .setPreference(key, !notificationPrefs[key])
      .catch(error => {
        console.error(error)
        showError()
      })
  }


  const handleLogout = () =>
    setConfirm({
      title: 'Sair da conta?',
      message: 'Suas listas continuam salvas. Entre de novo quando quiser.',
      confirmLabel: 'Sair',
      onConfirm: () =>
        runSafely(async () => {
          await push.forgetDevice()
          await logout()
        })
    })


  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        pb: 'calc(160px + env(safe-area-inset-bottom))'
      }}
    >
      <Container maxWidth="sm" disableGutters sx={{ px: 2 }}>
        {tab === 'list' && (
          selectedList ? (
            <>
              <ListHeader
                lists={lists}
                selectedList={selectedList}
                members={members}
                isOwner={isOwner}
                itemCount={items.length}
                checkedCount={checkedItems.length}
                onSelectList={selectList}
                onCreateList={() => setCreateListOpen(true)}
                onOpenMembers={() => setMembersOpen(true)}
                onRemoveChecked={handleRemoveChecked}
                onClearItems={handleClearItems}
                onDeleteList={handleDeleteList}
                onLeaveList={handleLeaveList}
                unreadCount={unreadCount}
                onOpenNotifications={handleOpenNotifications}
              />

              {items.length > 0 && (
                <ListSummary
                  total={total}
                  cartTotal={cartTotal}
                  itemCount={items.length}
                  checkedCount={checkedItems.length}
                  savings={savings}
                  priceDate={priceDate}
                  swapCount={swaps.size}
                  swapSavings={swapSavings}
                />
              )}

              <ShoppingList
                pendingItems={pendingItems}
                checkedItems={checkedItems}
                productsById={productsById}
                loading={itemsLoading}
                onAddItem={() => setAddItemOpen(true)}
                onToggle={toggleChecked}
                onUpdateAmount={updateAmount}
                onRemove={handleRemoveItem}
                onSavePrice={setItemPrice}
                swaps={swaps}
                season={SEASON}
                seasonalIds={SEASONAL_IDS}
                onOpenSwap={(item, swap) => setOpenSwap({ item, swap })}
              />
            </>
          ) : (
            <ListsPlaceholder failed={!listsLoading} />
          )
        )}

        {tab === 'recipes' && (
          <RecipesPanel
            recipes={recipes}
            categories={RECIPE_CATEGORIES}
            productsById={productsById}
            productsByName={productsByName}
            onOpenRecipe={setOpenRecipe}
          />
        )}

        {tab === 'settings' && (
          <SettingsPanel
            email={user?.email}
            isAdmin={isAdmin}
            ceasaStatus={ceasaStatus}
            refreshing={refreshing}
            onChangePassword={() => setPasswordOpen(true)}
            onLogout={handleLogout}
            onRefreshPrices={handleRefreshPrices}
            push={push}
            notificationPrefs={notificationPrefs}
            onTogglePush={handleTogglePush}
            onTogglePreference={handleTogglePreference}
          />
        )}

        <AdBanner />
      </Container>


      {tab === 'list' && selectedList && items.length > 0 && (
        <AddItemFab onClick={() => setAddItemOpen(true)} />
      )}


      {selectedList && (
        <>
          <AddItemDialog
            open={addItemOpen}
            onClose={() => setAddItemOpen(false)}
            products={products}
            items={items}
            onAdd={handleAddItem}
            season={SEASON}
            seasonalIds={SEASONAL_IDS}
          />

          <MembersDialog
            open={membersOpen}
            onClose={() => setMembersOpen(false)}
            list={selectedList}
            members={members}
            currentUserId={user?.uid}
            isOwner={isOwner}
            onInvite={handleInvite}
            onRemoveMember={handleRemoveMember}
          />
        </>
      )}

      <RecipeDialog
        recipe={openRecipe}
        onClose={() => setOpenRecipe(null)}
        productsById={productsById}
        productsByName={productsByName}
        listProductIds={listProductIds}
        listName={selectedList?.name}
        canAdd={!!selectedList}
        onAdd={handleAddRecipe}
      />

      <CreateListDialog
        open={createListOpen}
        onClose={() => setCreateListOpen(false)}
        onSubmit={handleCreateList}
      />

      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onExited={resetPasswordForm}
        newPassword={newPassword}
        onPasswordChange={setNewPassword}
        error={passwordError}
        loading={passwordLoading}
        onSubmit={handleChangePassword}
      />

      <SwapDialog
        swap={openSwap?.swap}
        item={openSwap?.item}
        onClose={() => setOpenSwap(null)}
        onSwap={handleSwap}
        onKeep={handleKeep}
      />

      <NotificationsDialog
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onOpenNotification={openNotification}
      />

      <ConfirmDialog
        confirm={confirm}
        onClose={() => setConfirm(null)}
      />


      <MainBottomNavigation
        value={tab}
        onChange={changeTab}
      />

      <AppSnackbar
        alert={alert}
        onClose={closeAlert}
      />
    </Box>
  )
}


export default MainScreen

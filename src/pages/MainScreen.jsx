import { useState } from 'react'

// Third-party

import {
  Alert,
  AppBar,
  Box,
  Container,
  Snackbar,
  Toolbar,
  Typography
} from '@mui/material'

// Components

import AddItemFab from '../features/shopping/AddItemFab'
import AddItemModal from '../features/shopping/AddItemModal'
import AdBanner from '../components/feedback/AdBanner'
import CreateListDialog from '../features/shopping/CreateListDialog'
import ListControls from '../features/shopping/ListControls'
import ListSelector from '../features/shopping/ListSelector'
import MainBottomNavigation from '../components/navigation/MainBottomNavigation'
import SettingsPanel from '../features/settings/SettingsPanel'
import ShareListDialog from '../features/shopping/ShareListDialog'
import ShoppingList from '../features/shopping/ShoppingList'

// Hooks

import useListMembers from '../hooks/useListMembers'
import usePassword from '../hooks/usePassword'
import usePriceUpload from '../hooks/usePriceUpload'
import useProducts from '../hooks/useProducts'
import useShoppingItems from '../hooks/useShoppingItems'
import useShoppingLists from '../hooks/useShoppingLists'

// Firebase

import { auth } from '../services/firebase'

// Utils

import {
  calculateTotalPrice,
  formatCurrency,
  getDisplayUnit,
  getEffectivePrice,
  getPriceColor,
  getProductName,
  getProductUnit
} from '../utils/shoppingHelpers'


function MainScreen() {
  const [newItem, setNewItem] =
    useState('')

  const [open, setOpen] =
    useState(false)

  const [navValue, setNavValue] =
    useState(0)

  const [alert, setAlert] =
    useState({
      open: false,
      severity: 'success',
      message: ''
    })

  const [
    createDialogOpen,
    setCreateDialogOpen
  ] = useState(false)

  const [
    shareDialogOpen,
    setShareDialogOpen
  ] = useState(false)

  const [
    newListName,
    setNewListName
  ] = useState('')

  const [
    shareEmail,
    setShareEmail
  ] = useState('')


  const {
    products
  } = useProducts()


  const {
    lists,
    selectedList,
    setSelectedList,
    createList: createShoppingList,
    removeMember: removeListMember,
    leaveList: leaveShoppingList,
    shareList: shareShoppingList,
    deleteList: deleteShoppingList,
    clearItems: clearShoppingListItems
  } = useShoppingLists()


  const members =
    useListMembers(
      selectedList
    )


  const {
    items,
    addItem,
    updateAmount,
    removeItem
  } = useShoppingItems(
    selectedList,
    products
  )


  const {
    newPassword,
    setNewPassword,
    passwordMessage,
    passwordError,
    changePassword,
    logout
  } = usePassword()


  const isAdmin =
    auth.currentUser?.email ===
    'jpchagas@gmail.com'


  /** Helper functions */

  const showAlert = (
    severity,
    message
  ) => {
    setAlert({
      open: true,
      severity,
      message
    })
  }


  const {
    handlePriceUpload
  } = usePriceUpload({
    showAlert
  })


  const createList = async () => {
    if (!newListName) return

    await createShoppingList(
      newListName
    )

    setNewListName('')

    setCreateDialogOpen(false)

    showAlert(
      'success',
      'Lista criada com sucesso!'
    )
  }


  const removeMember = async (
    userId
  ) => {
    await removeListMember(
      userId
    )

    showAlert(
      'success',
      'Membro removido'
    )
  }


  const leaveList = async () => {
    await leaveShoppingList()

    showAlert(
      'success',
      'Você saiu da lista'
    )
  }


  const shareList = async () => {
    const result =
      await shareShoppingList(
        shareEmail
      )

    if (
      !result ||
      result.success === false
    ) {
      if (
        result?.reason ===
        'not-found'
      ) {
        showAlert(
          'error',
          'Usuário não encontrado'
        )
      }

      if (
        result?.reason ===
        'already-member'
      ) {
        showAlert(
          'warning',
          'Usuário já possui acesso'
        )
      }

      return
    }

    setShareEmail('')
    setShareDialogOpen(false)

    showAlert(
      'success',
      'Lista compartilhada!'
    )
  }


  const deleteList = async () => {
    if (!selectedList) return

    const deletedId =
      selectedList.id

    await deleteShoppingList()

    const remaining =
      lists.filter(
        list =>
          list.id !== deletedId
      )

    setSelectedList(
      remaining[0] || null
    )

    showAlert(
      'success',
      'Lista removida'
    )
  }


  const clearItems = async () => {
    await clearShoppingListItems()

    showAlert(
      'success',
      'Itens removidos da lista'
    )
  }


  const totalPrice =
    calculateTotalPrice(
      items,
      products
    )


  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        pb: 7
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1
            }}
          >
            Xepa
          </Typography>
        </Toolbar>
      </AppBar>


      <Container sx={{ mt: 2 }}>
        {navValue === 0 &&
          selectedList && (
            <>
              <ListSelector
                lists={lists}
                selectedList={
                  selectedList
                }
                setSelectedList={
                  setSelectedList
                }
              />


              <ListControls
                selectedList={
                  selectedList
                }
                members={members}
                onCreateList={() =>
                  setCreateDialogOpen(
                    true
                  )
                }
                onClearItems={
                  clearItems
                }
                onShareClick={() =>
                  setShareDialogOpen(
                    true
                  )
                }
                onDeleteList={
                  deleteList
                }
                onRemoveMember={
                  removeMember
                }
                onLeaveList={
                  leaveList
                }
                currentUserId={
                  auth.currentUser?.uid
                }
              />


              <ShoppingList
                items={items}
                getProductName={
                  productId =>
                    getProductName(
                      products,
                      productId
                    )
                }
                getProductUnit={
                  productId =>
                    getProductUnit(
                      products,
                      productId
                    )
                }
                getDisplayUnit={
                  productId =>
                    getDisplayUnit(
                      products,
                      productId
                    )
                }
                getEffectivePrice={
                  (
                    productId,
                    price
                  ) =>
                    getEffectivePrice(
                      products,
                      productId,
                      price
                    )
                }
                updateAmount={
                  updateAmount
                }
                removeItem={
                  removeItem
                }
                getPriceColor={
                  getPriceColor
                }
                formatCurrency={
                  formatCurrency
                }
                totalPrice={
                  totalPrice
                }
                selectedList={
                  selectedList
                }
              />
            </>
          )}


        {navValue === 1 && (
          <SettingsPanel
            newPassword={
              newPassword
            }
            setNewPassword={
              setNewPassword
            }
            passwordError={
              passwordError
            }
            passwordMessage={
              passwordMessage
            }
            handleChangePassword={
              changePassword
            }
            handleLogout={
              logout
            }
            isAdmin={isAdmin}
            products={products}
            addItem={addItem}
            selectedList={
              selectedList
            }
            handlePriceUpload={
              handlePriceUpload
            }
          />
        )}


        <AdBanner />
      </Container>


      {navValue === 0 && (
        <AddItemFab
          onClick={() =>
            setOpen(true)
          }
        />
      )}


      {selectedList && (
        <AddItemModal
          open={open}
          onClose={() =>
            setOpen(false)
          }
          products={products}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={addItem}
        />
      )}


      <CreateListDialog
        open={createDialogOpen}
        onClose={() =>
          setCreateDialogOpen(
            false
          )
        }
        value={newListName}
        onChange={
          setNewListName
        }
        onSubmit={createList}
      />


      <ShareListDialog
        open={shareDialogOpen}
        onClose={() =>
          setShareDialogOpen(
            false
          )
        }
        value={shareEmail}
        onChange={setShareEmail}
        onSubmit={shareList}
      />


      <MainBottomNavigation
        value={navValue}
        onChange={setNavValue}
      />


      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() =>
          setAlert({
            ...alert,
            open: false
          })
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() =>
            setAlert({
              ...alert,
              open: false
            })
          }
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}


export default MainScreen
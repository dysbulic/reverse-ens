import { useState, useEffect, useRef, Provider, useCallback } from 'react'
import Web3 from 'web3'
import {
  Stack, Input, Container, Flex, Button, Text, Box,
  Grid, useClipboard, useToast, Spinner, Tooltip,
  useBreakpointValue, Placement,
} from '@chakra-ui/react'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { abi as registrarABI } from '@ensdomains/ens-contracts/artifacts/contracts/registry/ReverseRegistrar.sol/ReverseRegistrar.json'
import { useParams } from 'react-router-dom'
import { CopyIcon } from '@chakra-ui/icons'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ReactElement } from 'react'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
}

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
})

const logger = (css: string) => (
  (...args: unknown[]) => {
    args[0] = `%c ${args[0]} `
    args.splice(1, 0, css)
    console.log.apply(this, args)
  }
)

interface Addresses extends Partial<Record<string, string>> {
  self?: string
  address?: string
  owner?: string
  reverse?: string
  net?: string
  resolver?: string
  registrar?: string
  name?: string
}

interface Contracts {
  resolver?: Contract
  registrar?: Contract
  reverseResolver?: Contract
}

interface Parameters {
  name?: string
}

const tooltips: Record<string, string> = {
  self: 'This is the address of your wallet. The reverse record is an ENS name that is returned when users search on this address. There is only one reverse record per address.',
  net: 'The currently selected ethereum chain. In general ENS resolution is done on the mainnet, but instances exist on some of the test chains as well.',
  registrar: 'This is the contract that controls name registration for the reverse records.',
  reverse: 'This is a specially formatted address that is used to look up your reverse record.',
  address: "The forward resolution for the currently selected name to use for the reverse record. There is no technical requirement that this resolve to your wallet address, but if it doesn't, many implementations will disregard the record.", 
  resolver: 'This is the contract address for the resolver for the resolution of reverse entries.',
  owner: 'When you create a reverse entry, you are set as the owner of the reverse address.',
  name: 'This is the currently configured reverse record for your wallet address.',
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const params = useParams<Parameters>()
  const [name, setName] = useState(params.name)
  const [web3, setWeb3] = useState<Web3>()
  const [titles, setTitles] = useState({
    self: 'Your Address',
    net: 'Current Network',
    registrar: 'Reverse Registrar Address',
    reverse: 'Reverse Address',
    resolver: 'Resolver Address',
    address: null as string | null,
    owner: 'Reverse Lookup Owner',
    name: 'Current Reverse',
  })
  const [addrs, setAddrs] = useState<Addresses>({})
  const [tracts, setTracts] = useState<Contracts>({})
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const placement = (
    useBreakpointValue<Placement>(['bottom', 'right'])
  )
  const input = useRef<HTMLInputElement | null>(null)

  const updateAddr = (obj: object) => {
    setAddrs(as => ({ ...as, ...obj }))
  }
  const updateTract = (obj: object) => {
    setTracts(ts => ({ ...ts, ...obj }))
  }

  const reset = () => {
    setAddrs({})
    setTracts({})
  }

  useEffect(() => {
    (async () => {
      setTitles((ts) => (
        { ...ts, address: name ? `${name}'s Address` : null }
      ))
      setAddrs((as) => (
        { ...as, address: undefined }
      ))

      if(!web3) return null

      try {
        if(!name) throw new Error('Name Not Set')
        const address = await web3.eth.ens.getAddress(name)
        updateAddr({ address })
      } catch(err) {
        updateAddr({ address: null })
      }
    })()
  }, [name, web3])

  const setProvider = useCallback(
    async (provider: any) => {
      const log = logger('color: purple')
      const web3 = new Web3(provider)
      setWeb3(web3)

      const addresses = await web3.eth.getAccounts()
      const addr = addresses[0]
      log('Wallet Address', addr)
      updateAddr({ self: addr })

      if(provider.on) {
        provider.on('close', reset)
        provider.on('networkChanged', reset)
        provider.on('chainChanged', reset)

        const resetAccount = (accts: string[]) => {
          reset()
          updateAddr({ self: accts[0] })
        }
        provider.on('accountsChanged', resetAccount)
      }
    },
    [],
  )

  useEffect(() => {
    if(web3Modal.cachedProvider) {
      web3Modal.connect().then(setProvider)
    }
  }, [setProvider])

  useEffect(() => {
    (async () => {
      if(!web3 || !addrs.self) return null

      const log = logger('color: orange; background-color: purple')
      const net = await (async () => {
        const chainId = await web3.eth.getChainId()
        switch(chainId) {
          case 1: return 'mainnet'
          case 2: return 'Morden'
          case 3: return 'Ropsten'
          case 4: return 'Rinkeby'
          case 42: return 'Kovan'
          case 100: return 'xDAI'
          default: return `unknown (id:${chainId})`
        }
      })()
      log('Setting Network Name', net)
      updateAddr({ net })

      let registrar: ReactElement | string = (
        await web3.eth.ens.getOwner('addr.reverse')
      )
      log('Reverse Registrar', registrar)
      let registrarContract
      if(!registrar || /^0x0+$/.test(registrar)) {
        registrar = <em>Error: Couldn't get reverse registrar.</em>
      } else {
        registrarContract = new web3.eth.Contract(
          registrarABI as AbiItem[], registrar
        )
        log('Reverse Registrar', registrarContract.options.address)
        updateTract({ registrar: registrarContract })
      }
      updateAddr({ registrar })

      const reverse: string = (
        `${addrs.self.substr(2)}.addr.reverse`
      )
      log('Adding Reverse Address', reverse)
      updateAddr({ reverse })

      let reverseResolver, address
      if(reverse) {
        updateAddr({
          owner: await web3.eth.ens.getOwner(reverse),
        })

        reverseResolver = await (
          web3.eth.ens.getResolver(reverse)
        )
        updateTract({ reverseResolver })

        address = reverseResolver.options.address
        updateAddr({ resolver: address })
      }

      let ensEntry = name

      if(!address || /^0x0+$/.test(address)) {
        updateAddr({ name: null })
      } else if(registrarContract && reverseResolver) {
        const node = await (
          registrarContract.methods.node(addrs.self).call()
        )
        const resolved = (
          (await reverseResolver.methods.name(node).call())
          ?? null
        )
        updateAddr({ name: resolved })
        if(!name) {
          ensEntry = resolved
          setName(resolved)
          toast({
            title: 'Set Name',
            description: (
              `Defaulting name to current reverse record: "${resolved}".`
            ),
            duration: 3000,
          })
          input.current?.focus()
        }
      }

      if(ensEntry) {
        try {
          const resolver = await web3.eth.ens.getResolver(ensEntry)
          updateTract({ resolver })
        } catch(err) {
          alert(err.message)
        }
      }
    })()
  }, [web3, addrs.self, name, toast])

  const handlers = [
    {
      name: 'Connect Ethereum Wallet',
      func: async () => {
        setProvider(await web3Modal.connect())
      },
      if: () => (!addrs.self),
    },
    {
      name: name ? (
        `Set ${name} As Reverse`
      ) : (
        'Enter A Name To Use As Reverse'
      ),
      func: async () => {
        if(!name || addrs.name === name) {
          if(name) {
            alert(`Reverse Already Set To: ${name}`)
          }
          return input.current?.focus()
        }
        if(
          !addrs.name
          || window.confirm(`Overwrite ${addrs.name}?`)
        ) {
          if(!tracts.registrar) {
            throw new Error('Reverse Registrar Contract Not Set')
          }
          setLoading(true)
          await (
            tracts.registrar.methods
            .setName(name)
            .send({ from: addrs.self })
          )
          updateTract({ resolver: undefined })
          updateAddr({ name: undefined, owner: undefined })
          setLoading(false)
        }
      },
      if: () => (
        ![
          addrs.net, addrs.reverse, addrs.registrar,
          addrs.address, addrs.owner,
          addrs.name, tracts.resolver,
          tracts.registrar, tracts.reverseResolver,
        ].some(tract => tract === undefined)
      )
    }
  ]

  return (
    <Container maxW="100%">
      <Stack>
        <Flex justify="center" justifyItems="center">
          <Text m={0} mr={2} alignSelf="center">
            ENS Name For Reverse Record:
          </Text>
          <Input
            w="auto" textAlign="center"
            placeholder="Exe: sample.ens.eth"
            value={name ?? ''} ref={input}
            onChange={(evt) => {
              setName(evt.target.value)
              updateAddr({ address: undefined })
              updateTract({ resolver: undefined })
            }}
          />
        </Flex>
        <Grid
          templateColumns={['auto', 'auto 1fr']}
          alignItems="center" maxW="100vw" mt={3}
        >
          {Object.entries(titles).map(([key, title], i) => {
            const { onCopy } = useClipboard(addrs[key] ?? '')
            if(!title) return null
            return (
              <Box
                key={i} display="contents"
                sx={{ '&:hover > *': { bg: '#FBFF0522' } }}
              >
                <Tooltip
                  hasArrow placement={placement}
                  label={tooltips[key]}
                >
                  <Text
                    textAlign={['left', 'right']}
                    m={0} pr={5} minW="12em"
                    userSelect="none"
                  >
                    {title}:
                  </Text>
                </Tooltip>
                <Text
                  m={0} textOverflow="clip" whiteSpace="nowrap"
                  title={addrs[key]} overflowX="hidden" ml={[5, 0]}
                >
                  {addrs[key] && (
                    <Button
                      title="Copy" mr={2} size="xs"
                      onClick={() => {
                        onCopy()
                        toast({
                          title: 'Value Copied',
                          duration: 1500,
                        })
                      }}
                    >
                      <CopyIcon/>
                    </Button>
                  )}
                  <code>
                    {addrs[key] === null ? (
                      <em>Unset</em>
                    ) : (
                      addrs[key]
                    )}
                  </code>
                </Text>
              </Box>
            )
          })}
        </Grid>
      </Stack>
      <Stack mt={3}>
        {handlers.map((h, i) => (
          <Button
            key={i}
            onClick={async () => {
              try {
                await h.func()
              } catch(err) {
                console.error(err)
                alert(err.message)
                setLoading(false)
              }
            }}
            disabled={loading || (h.if ? !h.if() : false)}
            m={0} mt="0 ! important"
          >
            {loading && (i + 1 === handlers.length) && (
              <Spinner size="sm" mr={3}/>
            )}
            {h.name}
          </Button>
        ))}
      </Stack>
    </Container>
  )
}
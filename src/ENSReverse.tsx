import { useState, useEffect } from 'react'
import Web3 from 'web3'
import MetamaskOnboarding from '@metamask/onboarding'
import {
  Stack, Input, Container, Flex, Button, Text, Box, Grid, useClipboard, useToast,
} from '@chakra-ui/react'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { abi as registrarABI } from '@ensdomains/ens-contracts/artifacts/contracts/registry/ReverseRegistrar.sol/ReverseRegistrar.json'
import { useParams } from 'react-router-dom'
import { CopyIcon } from '@chakra-ui/icons'

declare global {
  interface Window {
    ethereum: any
  }
}
const { ethereum } = window
const web3 = new Web3(ethereum)

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

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const onboarding = new MetamaskOnboarding()
  const params = useParams<Parameters>()
  const [name, setName] = useState(params.name)
  const [titles, setTitles] = useState({
    self: 'Your Address',
    net: 'Current Network',
    registrar: 'Reverse Registrar Address',
    reverse: 'Reverse Address',
    address: null as string | null,
    resolver: 'Resolver Address',
    owner: 'Reverse Lookup Owner',
    name: 'Reverse Lookup',
  })
  const [addrs, setAddrs] = useState<Addresses>({})
  const [tracts, setTracts] = useState<Contracts>({})
  const toast = useToast()

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
    ethereum?.on('chainChanged', reset)
    return () => ethereum?.off('chainChanged', reset)
  }, [])
  useEffect(() => {
    const resetAndSet = (accts: string[]) => {
      reset()
      updateAddr({ self: accts[0] })
    }
    ethereum?.on('accountsChanged', resetAndSet)
    return () => ethereum?.off(
      'accountsChanged', resetAndSet
    )
  }, [])

  useEffect(() => {
    setTitles((ts) => (
      { ...ts, address: name ? `${name}'s Address` : null }
    ))
    setAddrs((as) => (
      { ...as, address: undefined }
    ))
  }, [name])

  const handlers = [
    {
      name: 'Install MetaMask',
      func: () => onboarding.startOnboarding(),
      if: () => !MetamaskOnboarding.isMetaMaskInstalled(),
    },
    {
      name: 'Connect Ethereum Wallet',
      func: async () => {
        const log = logger('color: purple')
        log('Enabling Inpage Provider')
        const addresses = await (
          ethereum?.request({ method: 'eth_requestAccounts' })
        )
        const addr = addresses?.[0]
        log('Wallet Address', addr)
        updateAddr({ self: addr })
      },
      if: () => (!!ethereum && !addrs.self),
    },
    {
      name: 'Load Addresses',
      func: async () => {
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

        if(!addrs.self) {
          throw new Error('Wallet Address Not Set')
        }
        const reverse = (
          `${addrs.self.substr(2)}.addr.reverse`
        )
        log('Adding Reverse Address', reverse)
        updateAddr({ reverse })

        const registrar = (
          await web3.eth.ens.getOwner('addr.reverse')
        )
        log('Reverse Registrar', registrar)
        if(!registrar || /^0x0+$/.test(registrar)) {
          throw new Error("Couldn't Resolve Reverse Registrar")
        }
        updateAddr({ registrar })

        try {
          if(!name) {
            throw new Error('Name Not Set')
          }
          const address = await web3.eth.ens.getAddress(name)
          updateAddr({
            address,
            owner: await web3.eth.ens.getOwner(address),
          })
        } catch(err) {
          if(
            err.message.includes(
              'does not implement requested method'
            )
            || err.message.includes(
              'Name Not Set'
            )
          ) {
            updateAddr({ address: null, owner: null })
          } else {
            throw err
          }
        }
      },
      if: () => (
        !!addrs.self
        && (
          !addrs.net
          || !addrs.reverse
          || !addrs.registrar
          || addrs.address === undefined
        )
      ),
    },
    {
      name: 'Load Contracts',
      func: async () => {
        const log = logger('color: lightgray; background-color: black')

        if(!addrs.registrar) {
          throw new Error('Reverse Registrar Address Not Set')
        }
        const registrar = new web3.eth.Contract(
          registrarABI as AbiItem[], addrs.registrar
        )
        log('Reverse Registrar', registrar.options.address)
        updateTract({ registrar })

        if(name) {
          const resolver = await web3.eth.ens.getResolver(name)
          updateTract({ resolver })
        }

        if(!addrs.reverse) {
          throw new Error('Reverse Address Is Not Set')
        }
        const reverseResolver = await (
          web3.eth.ens.getResolver(addrs.reverse)
        )
        updateTract({ reverseResolver })

        const address = reverseResolver.options.address
        updateAddr({ resolver: address })

        if(/^0x0+$/.test(address)) {
          updateAddr({ name: null })
        } else {
          const node = await (
            registrar.methods.node(addrs.self).call()
          )
          const resolved = (
            (await reverseResolver.methods.name(node).call())
            ?? null
          )
          updateAddr({ name: resolved })
          if(!name) {
            setName(resolved)
          }
        }
      },
      if: () => (
        !!addrs.reverse
        && addrs.address !== undefined
        && !addrs.name
        && !tracts.resolver
        && !tracts.registrar
        && !tracts.reverseResolver
      ),
    },
    {
      name: name ? (
        `Set ${name} As Reverse`
      ) : (
        'Enter A Name To Use As Reverse'
      ),
      func: async () => {
        if(addrs.name === name) {
          return alert(`Reverse Already Set To: ${name}`)
        }
        if(
          !addrs.name
          || window.confirm(`Overwrite ${addrs.name}?`)
        ) {
          if(!tracts.registrar) {
            throw new Error('Reverse Registrar Contract Not Set')
          }
          await (
            tracts.registrar.methods
            .setName(name)
            .send({ from: addrs.self })
          )
          updateTract({ resolver: undefined })
          updateAddr({ name: undefined })
        }
      },
      if: () => (!!tracts.registrar && addrs.address !== undefined)
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
            value={name ?? ''}
            onChange={(evt) => {
              setName(evt.target.value)
              updateAddr({ address: undefined })
              updateTract({ resolver: undefined })
            }}
          />
        </Flex>
        <Grid templateColumns="auto 1fr" alignItems="center">
          {Object.entries(titles).map(([key, title], i) => {
            const { onCopy } = useClipboard(addrs[key] ?? '')
            if(!title) return null
            return (
              <Box
                key={i} display="contents"
                sx={{ '&:hover > *': { bg: '#FBFF0522' } }}
              >
                <Text m={0} textAlign="right" pr={5} minW="12em">
                  {title}:
                </Text>
                <Text m={0} textOverflow="clip" whiteSpace="nowrap" title={addrs[key]}>
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
      <Stack>
        {handlers.map((h, i) => (
          <Button
            key={i}
            onClick={async () => {
              try {
                await h.func()
              } catch(err) {
                console.error(err)
                alert(err.message)
              }
            }}
            disabled={h.if ? !h.if() : false}
            m={0} mt="0 ! important"
          >
            {h.name}
          </Button>
        ))}
      </Stack>
    </Container>
  )
}
import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionar(produto) {
    setItens((atuais) => {
      const existente = atuais.find((item) => item.produto.id === produto.id);

      if (existente) {
        return atuais.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }

      return [...atuais, { produto, quantidade: 1 }];
    });
  }

  function diminuir(produtoId) {
    setItens((atuais) =>
      atuais
        .map((item) =>
          item.produto.id === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  }

  function remover(produtoId) {
    setItens((atuais) => atuais.filter((item) => item.produto.id !== produtoId));
  }

  function limpar() {
    setItens([]);
  }

  const quantidadeTotal = useMemo(
    () => itens.reduce((total, item) => total + item.quantidade, 0),
    [itens],
  );

  return (
    <CartContext.Provider value={{ itens, adicionar, diminuir, remover, limpar, quantidadeTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
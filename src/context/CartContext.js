import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [itens, setItens] = useState([]);

    function adicionar(produto) {
        setItens((itensAtuais) => {
        const produtoExistente = itensAtuais.find(
            (item) => item.produto.id === produto.id
        );

        if (produtoExistente) {
            return itensAtuais.map((item) =>
            item.produto.id === produto.id
                ? {
                    ...item,
                    quantidade: item.quantidade + 1,
                }
                : item
            );
        }

        return [
            ...itensAtuais,
            {
            produto,
            quantidade: 1,
            },
        ];
        });
    }

    function diminuir(produtoId) {
        setItens((itensAtuais) => {
        return itensAtuais
            .map((item) => {
            if (item.produto.id === produtoId) {
                return {
                ...item,
                quantidade: item.quantidade - 1,
                };
            }

            return item;
            })
            .filter((item) => item.quantidade > 0);
        });
    }

    function remover(produtoId) {
        setItens((itensAtuais) =>
        itensAtuais.filter((item) => item.produto.id !== produtoId)
        );
    }

    function limpar() {
        setItens([]);
    }

    const quantidadeTotal = itens.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    return (
        <CartContext.Provider
        value={{
            itens,
            adicionar,
            diminuir,
            remover,
            limpar,
            quantidadeTotal,
        }}
        >
        {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
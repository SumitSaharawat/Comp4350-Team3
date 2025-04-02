"use client";

/**
 * Transactions page
 */
import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTags } from "@/app/contexts/TagContext";
// components
import Layout from "@/components/ui/Layout";
import TransactionList from "@/components/ui/Transaction/TransactionList";
import { FloatingButton, FilterButton } from "@/components/ui/Button";
import TransactionFormModal from "@/components/ui/Transaction/TransactionFormModal";
import { SearchBar } from "@/components/ui/Input";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user } = useAuth();
    const { getTags, handleGetTagsNameList } = useTags();
    const [data, setData] = useState<Transaction[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(
        null
    );
    const searchHint = "Search Transaction";

    // change the transactions displayed on the fly when search term is changing
    const onSearchTermChange = (searchTerm: string) => {
        setData(
            transactions.filter((transaction) =>
                transaction.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    };

    // find out the target tag name
    const onSelectCategory = (items: string[]) => {
        setData(
            items.length > 0
                ? transactions.filter((transaction) =>
                    transaction.tags.some((tag) =>
                        items.some((i) =>
                            tag.name.toLowerCase().includes(i.toLowerCase())
                        )
                    )
                )
                : transactions
        );
    };

    // render for all transactions
    const getDataOnRender = async () => {
        try {
            const success = await getTransactions(
                user?.id || (localStorage.getItem("userid") as string)
            );
            if (success) {
                setData(transactions);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Transactions fetch failed!");
            }
        }
    };

    // fetch for all tags
    const renderTags = async () =>{
        await getTags(user?.id || (localStorage.getItem("userid") as string));
    };

    useEffect(() => {
        renderTags();
        getDataOnRender();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setData(transactions);
        renderTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);

    // **OPEN MODAL FOR ADDING**
    const openAddModal = () => {
        setEditTransaction(null);
        setIsFormOpen(true);
    };

    // **OPEN MODAL FOR EDITING**
    const openEditModal = (transaction: Transaction) => {
        setEditTransaction(transaction);
        setIsFormOpen(true);
    };

    // **CLOSE MODAL**
    const closeModal = () => {
        setIsFormOpen(false);
        setEditTransaction(null);
    };

    const middleComponent = (
        <div className="flex-1 flex justify-center">
            <SearchBar
                searchHint={searchHint || ""}
                onTextChange={onSearchTermChange}
            />

            <FilterButton
                filterName="Category"
                filterOptions={handleGetTagsNameList()}
                onSelectOption={onSelectCategory}
            />
        </div>
    );

    return (
        <Layout title="Transactions" middleComponent={middleComponent}>
            {/* Transactions List */}
            <TransactionList transactions={data} onEdit={openEditModal} />

            {/* Floating + button */}
            <FloatingButton toggle={openAddModal} />

            {/* Transaction Form Modal */}
            <TransactionFormModal
                isOpen={isFormOpen}
                toggle={closeModal}
                refreshTransactions={getDataOnRender}
                mode={editTransaction ? "edit" : "add"}
                existingTransaction={editTransaction}
            />
        </Layout>
    );
}
